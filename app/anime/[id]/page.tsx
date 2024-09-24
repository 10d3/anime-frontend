import AnimeStarter from "@/components/shared/AnimeStarter";
import { useSearchParams } from "next/navigation";
import React from "react";

interface paramsProp {
  params: {
    id: string;
    ep: number;
  };
  searchParams: {
    ep: number;
  };
}

function formatAnimeTitle(title:string) {
  const cleanedTitle = title.replace(/-tv-\d+$/, "");
  const words = cleanedTitle.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const formattedTitle = capitalizedWords.join(" ");
  return formattedTitle;
}

export async function generateMetadata({ params }: paramsProp) {
  const fetchRecentAnime = async () => {
    const url = `https://api-anim.vercel.app/anime/gogoanime/info/${params.id}`;
    const res = await fetch(url);
    return res.json();
  };
  const data = await fetchRecentAnime()
  return {
    title: formatAnimeTitle(data.title),
    openGraph: {
      title: data.title,
      description: `${data.description}`,
      url: `${process.env.VERCEL_URL}/anime/${data.id}`,
      siteName: 'Animestart.vercel.app',
      images: [
        {
          url: data.image, // Dynamic og route
          width: 800,
          height: 600,
        },
        {
          url: data.image, // Dynamic og route
          width: 1800,
          height: 1600,
          alt: `image of ${data.title}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function Page({ params, searchParams }: paramsProp) {
  const test = params.id.toLocaleLowerCase();
  // console.log(params.id);
  return (
    <div>
      <AnimeStarter params={params} searchParams={searchParams} />
    </div>
  );
}
