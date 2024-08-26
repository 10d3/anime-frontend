"use client";
import React, { useState, useEffect, useRef } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayer,
  MediaProvider,
  MediaPlayerInstance,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

interface Source {
  url: string;
  isM3U8: boolean;
  quality: string;
}

interface EpisodeLinks {
  id: string;
  title: string;
  image: string;
  number: number;
  description: string | null;
  url: string;
  referer: string;
  videoSources: Source[];
  downloadLink: string;
}

export const AnimeEp = ({ link }: { link: EpisodeLinks[] }) => {
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeLinks | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>("1080p");
  const [watchTimes, setWatchTimes] = useState<{ [id: string]: number }>({});
  const videoPlayerRef = useRef<MediaPlayerInstance | null>(null);

  // Charger les temps de visionnage depuis localStorage
  useEffect(() => {
    const savedWatchTimes = JSON.parse(localStorage.getItem("watchTimes") || "{}");
    setWatchTimes(savedWatchTimes);
  }, []);

  // Sauvegarder les temps de visionnage dans localStorage
  useEffect(() => {
    if (Object.keys(watchTimes).length > 0) {
      localStorage.setItem("watchTimes", JSON.stringify(watchTimes));
    }
  }, [watchTimes]);

  const handleEpisodeClick = (episode: EpisodeLinks) => {
    setSelectedEpisode(episode);
    const defaultQuality =
      episode.videoSources && Array.isArray(episode.videoSources)
        ? episode.videoSources.find((source) => source.quality === "1080p")?.quality
        : "1080p";

    setSelectedQuality(defaultQuality ?? "1080p");

    const savedTime = watchTimes[episode.id] || 0;
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = savedTime;
    }
  };

  const handleTimeUpdate = () => {
    if (videoPlayerRef.current && selectedEpisode) {
      const currentTime = videoPlayerRef.current.currentTime;
      const savedTime = watchTimes[selectedEpisode.id] || 0;

      if (currentTime > savedTime) {
        setWatchTimes((prevTimes) => ({
          ...prevTimes,
          [selectedEpisode.id]: currentTime,
        }));
      }
    }
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Conditional assignment of selectedSource
  let selectedSource: Source | null = null;
  if (selectedEpisode && selectedEpisode.videoSources) {
    selectedSource = selectedEpisode.videoSources.find((source) => source.quality === selectedQuality) || null;
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 grid gap-4">
        <div className="flex md:flex-row flex-col gap-2 items-center">
          <div className="flex flex-1">
            {selectedEpisode && (
              <div className="max-w-4xl mx-auto flex flex-col">
                <MediaPlayer
                  ref={videoPlayerRef}
                  src={selectedSource?.url || ""}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedData={() => {
                    if (videoPlayerRef.current && selectedEpisode) {
                      const savedTime = watchTimes[selectedEpisode.id] || 0;
                      videoPlayerRef.current.currentTime = savedTime;
                    }
                  }}
                >
                  <MediaProvider />
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
              </div>
            )}
          </div>

          <div className={`flex flex-col gap-2 w-full ${selectedEpisode ? `md:w-1/3` : `md:w-full`}`}>
            <h2 className="text-3xl font-bold mb-6">Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {link.map((episode) => (
                <div
                  key={episode.number}
                  className="bg-muted rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="p-4 min-h-10">
                    <div className="text-sm text-muted-foreground">{`Episode ${episode.number}`}</div>
                    {watchTimes[episode.id] && (
                      <div className="text-xs text-muted-foreground">
                        Watched: {formatTime(watchTimes[episode.id])}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
