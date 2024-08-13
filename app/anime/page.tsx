import AnimeLoad from '@/components/shared/AnimeLoad'
import React from 'react'

interface PageProps {
  searchParams: {
    q?: string | undefined,
    // eventtype?: string | undefined,
    // location?: string | undefined,
    page?: string
  }
}

export default function page({searchParams:{q}} : PageProps) {
  const filterValues = {
    q,
    // eventtype,
    // location,
    page:'1'
  }
  return (
    <main className='flex min-h-dvh flex-col items-center justify-between pb-24 pt-4'>
      <AnimeLoad filterValues={filterValues} />
    </main>
  )
}
