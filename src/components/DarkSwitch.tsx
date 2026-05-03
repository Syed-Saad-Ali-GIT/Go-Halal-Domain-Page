"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden />;
  }

  return (
    <div className="order-last flex items-center">
      {theme === "dark" ? (
        <button
          type="button"
          onClick={() => setTheme("light")}
          className="rounded-full p-2 text-gh-primary outline-none hover:bg-gh-card dark:hover:bg-gh-surface-dark"
          aria-label="Switch to light mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className="rounded-full p-2 text-gh-text-light outline-none hover:bg-gh-card focus-visible:ring-2 focus-visible:ring-gh-primary/60"
          aria-label="Switch to dark mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ThemeChanger;
