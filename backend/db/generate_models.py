"""Generate SQLAlchemy ORM models from the live PostgreSQL database.

The database schema dump is managed separately by generate_schema.py.
Enum classes are generated directly in app/models/generated.py.
"""

from __future__ import annotations

import ast
import shutil
import subprocess
import sys
from pathlib import Path

from app.config.settings import settings

BACKEND_DIR = Path(__file__).resolve().parents[1]
MODELS_DIR = BACKEND_DIR / "app" / "models"
ORM_OUTPUT_FILE = MODELS_DIR / "generated.py"
TEMP_OUTPUT_FILE = MODELS_DIR / "generated.tmp.py"


class GeneratedModelTransformer(ast.NodeTransformer):
    """Keep generated enums in one file and map their values to PostgreSQL."""

    def __init__(self) -> None:
        self.enum_classes: set[str] = set()

    @staticmethod
    def _is_str_enum(node: ast.ClassDef) -> bool:
        """Return whether a class inherits from str and enum.Enum."""
        has_str = any(isinstance(base, ast.Name) and base.id == "str" for base in node.bases)
        has_enum = any(
            isinstance(base, ast.Attribute)
            and isinstance(base.value, ast.Name)
            and base.value.id == "enum"
            and base.attr == "Enum"
            for base in node.bases
        )
        return has_str and has_enum

    @staticmethod
    def _is_enum_call(node: ast.Call) -> bool:
        """Return whether a call refers to SQLAlchemy's Enum type."""
        if isinstance(node.func, ast.Name):
            return node.func.id == "Enum"

        return isinstance(node.func, ast.Attribute) and node.func.attr == "Enum"

    def visit_Module(self, node: ast.Module) -> ast.Module:
        """Collect generated string enums before transforming the module."""
        self.enum_classes = {
            item.name
            for item in node.body
            if isinstance(item, ast.ClassDef) and self._is_str_enum(item)
        }

        self.generic_visit(node)

        # Ensure enum.StrEnum has its required module import.
        uses_enum_module = any(
            isinstance(item, ast.Import) and any(alias.name == "enum" for alias in item.names)
            for item in node.body
        )

        if self.enum_classes and not uses_enum_module:
            import_node = ast.Import(names=[ast.alias(name="enum")])

            insert_at = 0

            # Preserve a module docstring as the first statement.
            if (
                node.body
                and isinstance(node.body[0], ast.Expr)
                and isinstance(node.body[0].value, ast.Constant)
                and isinstance(node.body[0].value.value, str)
            ):
                insert_at = 1

            # Future imports must remain at the top of the file.
            while (
                insert_at < len(node.body)
                and isinstance(node.body[insert_at], ast.ImportFrom)
                and node.body[insert_at].module == "__future__"
            ):
                insert_at += 1

            node.body.insert(insert_at, import_node)

        return node

    def visit_ClassDef(self, node: ast.ClassDef) -> ast.ClassDef:
        """Replace generated str + enum.Enum inheritance with enum.StrEnum."""
        self.generic_visit(node)

        if self._is_str_enum(node):
            node.bases = [
                ast.Attribute(
                    value=ast.Name(id="enum", ctx=ast.Load()),
                    attr="StrEnum",
                    ctx=ast.Load(),
                )
            ]
            self.enum_classes.add(node.name)

        return node

    def visit_Call(self, node: ast.Call) -> ast.Call:
        """Persist enum values, not Python member names, to PostgreSQL."""
        self.generic_visit(node)

        if not self._is_enum_call(node) or not node.args:
            return node

        first_arg = node.args[0]

        if not (isinstance(first_arg, ast.Name) and first_arg.id in self.enum_classes):
            return node

        # SQLAlchemy normally persists enum member names, such as MAP.
        # PostgreSQL expects the actual labels, such as 'map'.
        has_values_callable = any(keyword.arg == "values_callable" for keyword in node.keywords)

        if not has_values_callable:
            values_callable = ast.Lambda(
                args=ast.arguments(
                    posonlyargs=[],
                    args=[
                        ast.arg(arg="enum_cls"),
                    ],
                    kwonlyargs=[],
                    kw_defaults=[],
                    defaults=[],
                ),
                body=ast.ListComp(
                    elt=ast.Attribute(
                        value=ast.Name(
                            id="member",
                            ctx=ast.Load(),
                        ),
                        attr="value",
                        ctx=ast.Load(),
                    ),
                    generators=[
                        ast.comprehension(
                            target=ast.Name(
                                id="member",
                                ctx=ast.Store(),
                            ),
                            iter=ast.Name(
                                id="enum_cls",
                                ctx=ast.Load(),
                            ),
                            ifs=[],
                            is_async=0,
                        )
                    ],
                ),
            )

            node.keywords.append(
                ast.keyword(
                    arg="values_callable",
                    value=values_callable,
                )
            )

        return node


def generate_orm() -> None:
    """Generate ORM models from the live database."""
    sqlacodegen = shutil.which("sqlacodegen")

    if sqlacodegen is None:
        raise RuntimeError(
            "Could not find sqlacodegen. Install the project dependencies "
            "and run this script with 'uv run'."
        )

    database_url = settings.database_url

    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured.")

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    command = [
        sqlacodegen,
        database_url,
        "--schema",
        "public",
        "--outfile",
        str(TEMP_OUTPUT_FILE),
    ]

    try:
        print("Generating SQLAlchemy models from PostgreSQL...")
        subprocess.run(
            command,
            cwd=BACKEND_DIR,
            check=True,
        )

        if not TEMP_OUTPUT_FILE.exists():
            raise RuntimeError("sqlacodegen completed without creating its output file.")

        source = TEMP_OUTPUT_FILE.read_text(encoding="utf-8")
        tree = ast.parse(source)

        transformer = GeneratedModelTransformer()
        tree = transformer.visit(tree)
        ast.fix_missing_locations(tree)

        generated_source = ast.unparse(tree) + "\n"

        # Validate the transformed source before replacing the existing file.
        compile(
            generated_source,
            str(ORM_OUTPUT_FILE),
            "exec",
        )

        ORM_OUTPUT_FILE.write_text(
            generated_source,
            encoding="utf-8",
        )

        print(f"Generated ORM models: {ORM_OUTPUT_FILE}")

        if transformer.enum_classes:
            print("Generated enum classes: " + ", ".join(sorted(transformer.enum_classes)))

    finally:
        TEMP_OUTPUT_FILE.unlink(missing_ok=True)


def format_generated_file() -> None:
    """Format and lint the generated ORM module."""
    print("Formatting generated models...")

    subprocess.run(
        [
            sys.executable,
            "-m",
            "ruff",
            "format",
            str(ORM_OUTPUT_FILE),
        ],
        cwd=BACKEND_DIR,
        check=True,
    )

    subprocess.run(
        [
            sys.executable,
            "-m",
            "ruff",
            "check",
            "--fix",
            str(ORM_OUTPUT_FILE),
        ],
        cwd=BACKEND_DIR,
        check=True,
    )


def main() -> None:
    """Run the complete ORM generation process."""
    generate_orm()
    format_generated_file()
    print("Model generation completed successfully.")


if __name__ == "__main__":
    main()
