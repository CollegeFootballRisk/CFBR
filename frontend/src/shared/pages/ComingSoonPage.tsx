import { Link } from "react-router-dom";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

function ComingSoonPage({
  title,
  description = "This part of College Football Risk is still being rebuilt.",
}: ComingSoonPageProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-400">{description}</p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Back to Map
        </Link>
      </div>
    </div>
  );
}

export default ComingSoonPage;
