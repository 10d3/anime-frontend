import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { AspectRatio } from "../ui/aspect-ratio";

interface AnimeCardProps {
  title: string;
  image: string;
  duration?: string;
  episode: number;
  type: string;
  id: string;
  mailId?: string;
}
export default function AnimeCard({
  title,
  image,
  duration,
  episode,
  type,
  id,
  mailId,
}: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <AspectRatio ratio={3 / 4}>
            <img
              width={1000}
              height={1000}
              src={image}
              alt={title}
              className="object-cover w-full h-full transition-all hover:scale-105"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <h2 className="text-[0.8rem] md:text-sm sm:text-base font-bold tracking-tight truncate">
            {title}
          </h2>
        </CardContent>
      </Card>
    </Link>
  );
}
