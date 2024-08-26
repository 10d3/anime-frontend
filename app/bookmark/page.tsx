import BookmarkPage from "@/components/shared/BookmarkPage"
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Booked List of your anime",
  description: "See your favorite anime",
  keywords: [
    "anime",
    "streaming anime",
    "anime en ligne",
    "séries animées",
    "épisodes d'anime",
    "anime japonais",
    "manga",
    "anime gratuit",
    "regarder anime",
    "anime en HD",
    "meilleurs anime",
    "nouveaux anime",
    "anime populaires",
  ],
  openGraph: {
    title: "Booked List of your anime",
    description: "See your favorite anime",
    tags: [
      "anime",
      "streaming anime",
      "anime en ligne",
      "séries animées",
      "épisodes d'anime",
      "anime japonais",
      "manga",
      "anime gratuit",
      "regarder anime",
      "anime en HD",
      "meilleurs anime",
      "nouveaux anime",
      "anime populaires",
    ],
    images: [
      {
        url: `https://res.cloudinary.com/daqehqcut/image/upload/v1724473140/metadata_1_zilvbf.png`, // Dynamic og route
        width: 800,
        height: 600,
      },
      {
        url: `https://res.cloudinary.com/daqehqcut/image/upload/v1724473140/metadata_1_zilvbf.png`, // Dynamic og route
        width: 1800,
        height: 1600,
        alt: `image of Animestart`,
      },
    ],
  },
};
export default async function page() {
  return (
    <>
      <BookmarkPage />
    </>
  );
}
