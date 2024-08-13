import { animeSearchSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const AnimeSearchBar = () => {
  async function searchAnime(formData: FormData) {
    "use server";

    const values = Object.fromEntries(formData.entries());
    const { q } = animeSearchSchema.parse(values);
    const searchParams = new URLSearchParams({
      ...(q && { q: q.trim() }),
      //   ...(eventtype && { eventtype: eventtype }),
      //   ...(location && { location: location }),
    });

    redirect(`anime/?${searchParams.toString()}`);
  }
  return (
    <div>
      <form action={searchAnime}>
        <div className="flex flex-col gap-3">
          <div className="flex">
            {/* <Label htmlFor='q'>Search</Label> */}
            <Input
              className=""
              id="q"
              name="q"
              placeholder="Search event"
            />
          </div>
          <Button className=" bg-primary" type="submit">Search Anime</Button>
        </div>
      </form>
    </div>
  );
};
