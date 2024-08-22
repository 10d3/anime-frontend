import AnimeLoad from '@/components/shared/AnimeLoad'
import React from 'react'

interface PageProps {
  searchParams: {
    q?: string | undefined,
    // eventtype?: string | undefined,
    // location?: string | undefined,
    page?: string,
    genre?: string
  }
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


export default function page({searchParams:{q, genre, page}} : PageProps) {
  const filterValues = {
    q,
    // eventtype,
    // location,
    page,
    genre
  }
  return (
    <main className='flex min-h-dvh flex-col items-center justify-between pt-4'>
      <AnimeLoad filterValues={filterValues} />
    </main>
  )
}
