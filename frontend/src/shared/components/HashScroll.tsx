// SPDX-License-Identifier: MPL-2.0

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [hash]);

  return null;
}
