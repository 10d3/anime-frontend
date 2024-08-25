'use client';
import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';

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
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p'); // Valeur par défaut
  const [watchTimes, setWatchTimes] = useState<{ [id: string]: number }>({});
  const videoPlayerRef = useRef<any>(null);

  useEffect(() => {
    const savedWatchTimes = JSON.parse(localStorage.getItem('watchTimes') || '{}');
    setWatchTimes(savedWatchTimes);
  }, []);

  useEffect(() => {
    localStorage.setItem('watchTimes', JSON.stringify(watchTimes));
  }, [watchTimes]);

  const handleEpisodeClick = (episode: EpisodeLinks) => {
    setSelectedEpisode(episode);
    // Définir la qualité par défaut à 1080p ou à la première qualité disponible
    const defaultQuality = episode.videoSources.find(source => source.quality === '1080p')?.quality || episode.videoSources[0].quality;
    setSelectedQuality(defaultQuality);
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    if (videoPlayerRef.current) {
      const player = videoPlayerRef.current;
      const selectedSource = selectedEpisode?.videoSources.find(
        (source) => source.quality === quality
      );

      if (selectedSource) {
        player.src({
          src: selectedSource.url,
          type: selectedSource.isM3U8 ? 'application/x-mpegURL' : 'video/mp4',
        });
        player.play();
      }
    }
  };

  const handleTimeUpdate = (currentTime: number) => {
    if (selectedEpisode) {
      setWatchTimes((prevTimes) => ({
        ...prevTimes,
        [selectedEpisode.id]: currentTime,
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Récupérer la source vidéo sélectionnée
  const selectedSource = selectedEpisode?.videoSources.find(
    (source) => source.quality === selectedQuality
  ) || selectedEpisode?.videoSources[0];

  const videoJsOptions = selectedSource
    ? {
        sources: [
          {
            src: selectedSource.url,
            type: selectedSource.isM3U8 ? 'application/x-mpegURL' : 'video/mp4',
            label: selectedSource.quality,
          },
        ],
        controls: true,
        fluid: true,
        plugins: {}, // Pas de plugin supplémentaire
        controlBar: {
          children: [
            'playToggle', // Play/Pause button
            'volumePanel', // Volume control
            'progressControl', // Progress bar
            'remainingTimeDisplay', // Remaining time
            'fullscreenToggle' // Fullscreen button
          ],
          volumePanel: {
            inline: false, // Volume control as a dropdown
          },
        },
        onTimeUpdate: handleTimeUpdate,
      }
    : {};

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 grid gap-4">
        <div className='flex md:flex-row flex-col gap-2'>
          <div className='flex flex-1'>
          {/* <h2 className="text-3xl font-bold mb-6">Episodes</h2> */}
          {/* Le lecteur vidéo */}
          {selectedEpisode && (
            <div className="relative w-full flex h-80 bg-black flex-1">
              <VideoPlayer
                // ref={videoPlayerRef}
                key={selectedEpisode.number}
                options={videoJsOptions}
              />
              <div className="absolute top-0 right-0 p-4 bg-black bg-opacity-50">
                <label htmlFor="quality-select" className="block mb-2 text-sm font-medium text-white">
                  Quality:
                </label>
                <select
                  id="quality-select"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm"
                  value={selectedQuality}
                  onChange={(e) => handleQualityChange(e.target.value)}
                >
                  {selectedEpisode.videoSources.map((source, index) => (
                    <option key={index} value={source.quality}>
                      {source.quality}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          </div>

          {/* Liste des épisodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-1/3">
            {link.map((episode) => (
              <div
                key={episode.number}
                className="bg-muted rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleEpisodeClick(episode)}
              >
                <div className="p-4 min-h-10">
                  <div className="text-sm text-muted-foreground">{`Episode ${episode.number}`}</div>
                  {/* Afficher la durée regardée */}
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
    </section>
  );
};
