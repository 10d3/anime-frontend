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
