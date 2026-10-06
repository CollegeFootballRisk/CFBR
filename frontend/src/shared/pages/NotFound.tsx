// SPDX-License-Identifier: MPL-2.0

import { Link } from "@/shared/components/Link";

export default function NotFound() {
  return (
    <div className="px-4">
      <h1 className="pt-2 text-center text-[2em] font-bold">This page has been Temped...</h1>

      <h2 className="mt-0 text-center font-semibold">Error 404</h2>

      <div className="mt-4 text-center">
        <img src="/images/TempeSkyline.jpg" alt="Tempe Skyline" className="mx-auto max-w-full" />

        <br />

        <i className="text-sm">
          Tempe, Arizona (CC-BY-SA 3.0:{" "}
          <Link external href="https://en.wikipedia.org/wiki/User:NickSchweitzer">
            Schwnj
          </Link>{" "}
          at{" "}
          <Link external href="https://commons.wikimedia.org/wiki/File:Tempeskyline3.jpg">
            Wikipedia
          </Link>
          )
        </i>
      </div>

      <div className="mt-6 text-center">
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
