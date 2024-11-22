"use client";
import React, { useState, useEffect, useRef } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayer,
  MediaProvider,
  MediaPlayerInstance,
  useMediaStore,
  type MediaErrorDetail,
  type MediaCanPlayDetail,
  type MediaErrorEvent,
  type MediaCanPlayEvent,
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

export const AnimeEp = ({
  link,
  type,
}: {
  link: EpisodeLinks[];
  type: string;
}) => {
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeLinks | null>(
    null
  );
  const [selectedQuality, setSelectedQuality] = useState<string>("1080p");
  const [watchTimes, setWatchTimes] = useState<{
    [id: string]: { time: number; duration: number };
  }>({});
  const [isBuffering, setIsBuffering] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [autoQualityEnabled, setAutoQualityEnabled] = useState(true);
  const videoPlayerRef = useRef<MediaPlayerInstance | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const { qualities, quality, autoQuality, canSetQuality } =
    useMediaStore(videoPlayerRef);

  useEffect(() => {
    const savedWatchTimes = JSON.parse(
      localStorage.getItem("watchTimes") || "{}"
    );
    setWatchTimes(savedWatchTimes);
  }, []);

  useEffect(() => {
    if (Object.keys(watchTimes).length > 0) {
      localStorage.setItem("watchTimes", JSON.stringify(watchTimes));
    }
  }, [watchTimes]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedEpisode) {
      const currentIndex = link.findIndex((ep) => ep.id === selectedEpisode.id);
      if (currentIndex < link.length - 1) {
        const nextEpisode = link[currentIndex + 1];
        const preloadLink = document.createElement("link");
        preloadLink.rel = "preload";
        preloadLink.as = "video";
        preloadLink.href = nextEpisode.videoSources[0]?.url || "";
        document.head.appendChild(preloadLink);
      }
    }
  }, [selectedEpisode, link]);

  const handleEpisodeClick = (episode: EpisodeLinks) => {
    setNetworkError(null);
    setSelectedEpisode(episode);

    const lowestQuality =
      episode.videoSources.sort(
        (a, b) => parseInt(a.quality) - parseInt(b.quality)
      )[3]?.quality || "360p";

    setSelectedQuality(lowestQuality);

    const savedTime = watchTimes[episode.id]?.time || 0;
    if (videoPlayerRef.current) {
      const mediaElement = videoPlayerRef.current.el?.querySelector("video");
      if (mediaElement) {
        mediaElement.currentTime = savedTime;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoPlayerRef.current && selectedEpisode) {
      const mediaElement = videoPlayerRef.current.el?.querySelector("video");
      if (mediaElement) {
        const currentTime = mediaElement.currentTime;
        const duration = mediaElement.duration;
        const savedTime = watchTimes[selectedEpisode.id]?.time || 0;

        if (currentTime > savedTime) {
          setWatchTimes((prevTimes) => ({
            ...prevTimes,
            [selectedEpisode.id]: { time: currentTime, duration },
          }));
        }
      }
    }
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    if (videoPlayerRef.current) {
      const mediaElement = videoPlayerRef.current.el?.querySelector("video");
      if (mediaElement) {
        const currentTime = mediaElement.currentTime;
        mediaElement.currentTime = currentTime;
      }
    }
  };

  const handleError = (detail: MediaErrorDetail, event: MediaErrorEvent) => {
    setNetworkError("Video playback error. Retrying...");
    console.error("MediaErrorDetail:", detail);
    console.error("MediaErrorEvent:", event);

    if (selectedEpisode && autoQualityEnabled) {
      const qualities = selectedEpisode.videoSources
        .map((source) => parseInt(source.quality))
        .sort((a, b) => a - b);

      const currentQuality = parseInt(selectedQuality);
      const lowerQuality = qualities.find((q) => q < currentQuality);

      if (lowerQuality) {
        setSelectedQuality(`${lowerQuality}p`);
      }
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    retryTimeoutRef.current = setTimeout(() => {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.startLoading();
      }
    }, 3000);
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
    setNetworkError(null);
  };

  const handleCanPlay = (
    detail: MediaCanPlayDetail,
    event: MediaCanPlayEvent
  ) => {
    setNetworkError(null);

    if (autoQualityEnabled && videoPlayerRef.current) {
      const mediaElement = videoPlayerRef.current.el?.querySelector("video");
      if (mediaElement) {
        const buffered = mediaElement.buffered;
        const currentTime = mediaElement.currentTime;

        const bufferHealth =
          buffered.length > 0 ? buffered.end(0) - currentTime : 0;

        if (bufferHealth < 5 && selectedEpisode) {
          const qualities = selectedEpisode.videoSources
            .map((source) => parseInt(source.quality))
            .sort((a, b) => a - b);

          const currentQuality = parseInt(selectedQuality);
          const lowerQuality = qualities.find((q) => q < currentQuality);

          if (lowerQuality) {
            setSelectedQuality(`${lowerQuality}p`);
          }
        }
      }
    }
  };

  let selectedSource: Source | null = null;
  if (selectedEpisode && selectedEpisode.videoSources) {
    selectedSource =
      selectedEpisode.videoSources.find(
        (source) => source.quality === selectedQuality
      ) || null;
  }

  const calculateProgress = (episodeId: string) => {
    const episodeWatch = watchTimes[episodeId];
    if (episodeWatch && episodeWatch.duration > 0) {
      return (episodeWatch.time / episodeWatch.duration) * 100;
    }
    return 0;
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 grid gap-4">
        <div className="flex md:flex-row flex-col gap-2 items-center">
          <div className="flex flex-1 flex-col">
            {selectedEpisode && (
              <>
                <div className="max-w-4xl mx-auto flex flex-col">
                  <MediaPlayer
                    ref={videoPlayerRef}
                    src={selectedSource?.url || ""}
                    autoPlay
                    onTimeUpdate={handleTimeUpdate}
                    onError={handleError}
                    onWaiting={handleWaiting}
                    onPlaying={handlePlaying}
                    onCanPlay={handleCanPlay}
                    onLoadedData={() => {
                      if (videoPlayerRef.current && selectedEpisode) {
                        const savedTime =
                          watchTimes[selectedEpisode.id]?.time || 0;
                        videoPlayerRef.current.currentTime = savedTime;
                      }
                    }}
                  >
                    <MediaProvider />
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                  </MediaPlayer>
                </div>

                {/* Network status indicators */}
                {isBuffering && (
                  <div className="mt-2 text-yellow-500 text-center">
                    Buffering... Please wait
                  </div>
                )}
                {networkError && (
                  <div className="mt-2 text-red-500 text-center">
                    {networkError}
                  </div>
                )}

                {/* Quality control */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={autoQualityEnabled}
                      onChange={(e) => setAutoQualityEnabled(e.target.checked)}
                      id="autoQuality"
                    />
                    <label htmlFor="autoQuality">Auto Quality</label>
                  </div>
                  {!autoQualityEnabled && selectedEpisode.videoSources && (
                    <select
                      value={selectedQuality}
                      onChange={(e) => handleQualityChange(e.target.value)}
                      className="px-2 py-1 rounded border"
                    >
                      {selectedEpisode.videoSources
                        .sort(
                          (a, b) => parseInt(b.quality) - parseInt(a.quality)
                        )
                        .map((source) => (
                          <option key={source.quality} value={source.quality}>
                            {source.quality}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </>
            )}
          </div>

          <div
            className={`flex flex-col gap-2 w-full ${
              selectedEpisode ? `md:w-1/3` : `md:w-full`
            }`}
          >
            <h2 className="text-3xl font-bold mb-6">
              {type === "MOVIE" ? "Movie" : "Episodes"}
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              {link.map((episode) => (
                <div
                  key={episode.number}
                  className="bg-muted rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="p-4 min-h-10">
                    <div className="text-sm text-muted-foreground">{`Episode ${episode.number}`}</div>
                    {watchTimes[episode.id]?.duration > 0 && (
                      <div className="relative h-1 bg-gray-300 rounded-full overflow-hidden mt-1">
                        <div
                          className="absolute top-0 left-0 h-full bg-blue-500"
                          style={{ width: `${calculateProgress(episode.id)}%` }}
                        ></div>
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
