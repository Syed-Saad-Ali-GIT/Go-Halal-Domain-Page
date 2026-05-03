"use client";

import { useState } from "react";
import { Container } from "@/components/Container";

interface VideoProps {
  videoId: string;
}

export function Video({ videoId }: Readonly<VideoProps>) {
  const [playVideo, setPlayVideo] = useState(false);

  if (!videoId) return null;

  return (
    <Container className="!pb-4">
      <div className="relative mx-auto h-[min(70vw,28rem)] w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-gh-secondary-light via-gh-primary to-gh-tertiary shadow-gh lg:mb-14 lg:h-[440px]">
        {!playVideo ? (
          <button
            type="button"
            onClick={() => setPlayVideo(true)}
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white/95 transition hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 drop-shadow-md lg:h-28 lg:w-28"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?controls=1&autoplay=1`}
            title="YouTube video preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video h-full min-h-[200px] w-full"
          />
        )}
      </div>
    </Container>
  );
}
