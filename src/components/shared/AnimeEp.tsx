'use client'
import { PlayIcon } from "lucide-react";
import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";

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
  console.log(link)
  const [selectedQuality, setSelectedQuality] = useState("default");

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 grid gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {link?.length &&
              link.map((links, i) => {
                if (!links.videoSources || links.videoSources.length === 0) {
                  return null; // Skip if sources are not defined or empty
                }

                const selectedSource = links.videoSources.find(
                  (source) => source.quality === selectedQuality
                ) || links.videoSources[0]; // Par défaut, sélectionner la première qualité si aucune correspondance

                const videoJsOptions = {
                  sources: [
                    {
                      src: selectedSource.url,
                      type: selectedSource.isM3U8
                        ? "application/x-mpegURL"
                        : "video/mp4",
                      label: selectedSource.quality,
                    },
                  ],
                  controls: true,
                  fluid: true,
                };

                return (
                  <div
                    key={links.number}
                    className="bg-muted rounded-lg overflow-hidden shadow-lg"
                  >
                    <div className="aspect-video relative h-auto">
                      <div className="w-full">
                        <VideoPlayer key={links.number} options={videoJsOptions} />
                      </div>
                    </div>
                    <div className="p-4 min-h-10">
                      <div className="text-sm text-muted-foreground">{`Episode ${i + 1}`}</div>
                      {/* <div className="font-medium">{links.title}</div> */}
                    </div>
                    <div className="p-4">
                      <label htmlFor={`quality-select-${i}`} className="block mb-2 text-sm font-medium">
                        Quality:
                      </label>
                      <select
                        id={`quality-select-${i}`}
                        className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm"
                        value={selectedQuality}
                        onChange={(e) => handleQualityChange(e.target.value)}
                      >
                        {links.videoSources.map((source, index) => (
                          <option key={index} value={source.quality}>
                            {source.quality}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};
