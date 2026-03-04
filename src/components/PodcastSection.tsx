"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { PodcastEpisode } from "@/lib/mock-data";

interface PodcastSectionProps {
  episode: PodcastEpisode;
}

export default function PodcastSection({ episode }: PodcastSectionProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const hasAudio = !!episode.audioUrl;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section className="w-full bg-obsidian">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        {/* Section label */}
        <span className="mb-6 inline-block text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Latest Episode
        </span>

        {/* Episode info */}
        <div className="max-w-3xl">
          <p className="mb-2 text-sm text-parchment/40">
            Season {episode.season} · Episode {episode.episodeNumber}
          </p>

          <h2 className="font-serif text-3xl font-bold leading-snug text-parchment md:text-4xl">
            <Link
              href={`/podcast/${episode.slug}`}
              className="transition-colors hover:text-gold"
            >
              {episode.title}
            </Link>
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-parchment/65 font-light">
            {episode.description}
          </p>

          {episode.guest && (
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-gold">
              with {episode.guest.name}
            </p>
          )}
        </div>

        {/* Audio player */}
        <div className="mt-10 max-w-3xl rounded-lg border border-parchment/10 bg-obsidian p-6">
          {hasAudio && <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />}

          <div className="flex items-center gap-5">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              disabled={!hasAudio}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-oxblood text-parchment transition-colors hover:bg-oxblood/90 disabled:opacity-40"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="2" width="4" height="12" rx="1" />
                  <rect x="9" y="2" width="4" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2.5v11l10-5.5L4 2.5z" />
                </svg>
              )}
            </button>

            {/* Progress bar */}
            <div className="flex flex-1 flex-col gap-2">
              <div
                className="h-1.5 cursor-pointer rounded-full bg-parchment/10"
                onClick={seek}
              >
                <div
                  className="h-full rounded-full bg-gold transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-parchment/40">
                <span>{formatTime(currentTime)}</span>
                <span>{duration ? formatTime(duration) : "--:--"}</span>
              </div>
            </div>
          </div>

          {!hasAudio && (
            <p className="mt-4 text-center text-sm text-parchment/30">
              Episode audio coming soon
            </p>
          )}
        </div>

        {/* Show notes link */}
        <div className="mt-6">
          <Link
            href={`/podcast/${episode.slug}`}
            className="text-sm font-medium text-gold transition-colors hover:text-parchment"
          >
            Full show notes &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
