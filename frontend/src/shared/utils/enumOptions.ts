export function enumToOptions<const T extends string>(values: readonly T[]) {
  return values.map((value) => ({
    value,
    label: value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));
}
