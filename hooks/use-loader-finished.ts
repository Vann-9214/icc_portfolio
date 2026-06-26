"use client";

import { useState, useEffect } from "react";

// Returns true once the intro loader has finished and begun fading out.
// Polls the #intro-loader element for removal or the data-fading attribute.
export function useLoaderFinished(): boolean {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const loader = document.getElementById("intro-loader");
      if (!loader || loader.getAttribute("data-fading") === "true") {
        setFinished(true);
        if (!loader) clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  return finished;
}
