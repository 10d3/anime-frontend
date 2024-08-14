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
  // Supprimer les parties non désirées (ici, "tv-534")
  const cleanedTitle = title.replace(/-tv-\d+$/, "");

  // Remplacer les tirets par des espaces
  const words = cleanedTitle.split("-");

  // Mettre en majuscule la première lettre de chaque mot
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Joindre les mots avec des espaces
  const formattedTitle = capitalizedWords.join(" ");

  return formattedTitle;
}
export async function generateMetadata({ params }: paramsProp) {
  return {
    title: formatAnimeTitle(params.id),
  };
}

export default function Page({ params, searchParams }: paramsProp) {
  const test = params.id.toLocaleLowerCase();
  console.log(params.id);
  return (
    <div>
      <AnimeStarter params={params} searchParams={searchParams} />
    </div>
  );
}
