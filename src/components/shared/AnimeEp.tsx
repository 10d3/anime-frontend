import { PlayIcon } from "lucide-react";
import React from "react";
import VideoPlayer from "./VideoPlayer";

interface Source {
  url: string;
  isM3U8: boolean;
  quality: string;
}

interface EpisodeLinks {
  episode: number;
  headers: {
    Referer: string;
  };
  sources: Source[];
  download: string;
}

export const AnimeEp = (link: any) => {
  console.log(link)
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 grid gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {link.link?.length &&
              link.link.map((links: any) => {
                const videoJsOptions = {
                  sources: links.videoSources.map((source: Source) => ({
                    src: source.url,
                    type: source.isM3U8
                      ? "application/x-mpegURL"
                      : "video/mp4",
                    label: source.quality,
                  })),
                  controls: true,
                  fluid: true,
                };

                return (
                  <div
                    key={links.episode}
                    className="bg-muted rounded-lg overflow-hidden shadow-lg"
                  >
                    <div className="aspect-video relative">
                      <div className="w-full">
                        <VideoPlayer key={links.episode} options={videoJsOptions} />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="font-medium">{`Episode ${links.episode}`}</div>
                      <div className="text-sm text-muted-foreground">
                        {link.link.id}
                      </div>
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
