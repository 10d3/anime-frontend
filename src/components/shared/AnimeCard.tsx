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

interface AnimeCardProps {
  title: string;
  image: string;
  duration?: string;
  episode: number;
  type: string;
  id: string,
  mailId?:string
}
export default function AnimeCard({
  title,
  image,
  duration,
  episode,
  type,
  id,
  mailId
}: AnimeCardProps) {
  return (
    <Card className="w-[300px] h-auto">
      <CardHeader>
        <div className="w-[250px] m-auto">
          <Image
            className=" w-96 h-[250px] max-h-[260px] object-cover object-center rounded-md"
            priority
            width={1000}
            height={1000}
            src={image}
            alt={`image of ${title}`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription className=' line-clamp-1'>
            {description}
        </CardDescription> */}
        <div className=" mt-1 mb-1 flex flex-col gap-2">
          <div className="flex justify-between">
            <h2 className="line-clamp-1 text-[0.8rem] ">{episode}</h2>
            <Badge className=" bg-destructive">
              <h2>{type}</h2>
            </Badge>
          </div>
          <div>
            {duration && <h2>{duration}</h2>}
            <Link href={`/anime/${id}?ep=${mailId}`}>
              <Button>Watch</Button>
            </Link>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className='flex justify-between'>
        <Button>Buy Now</Button>
        <Link href={`/event/${slug}`}>Read More</Link>
    </CardFooter> */}
    </Card>
  );
}
