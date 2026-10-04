import { Link } from "@/shared/components/Link";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({
  title,
  description = "This part of College Football Risk is still being rebuilt.",
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl tracking-tight">{title}</h1>

        <p className="mt-4 ">{description}</p>

        <Link to="/" className="mt-6 inline-flex rounded-md px-4 py-2 text-sm font-medium">
          Back to Map
        </Link>
      </div>
    </div>
  );
}
