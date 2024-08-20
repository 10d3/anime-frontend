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

    // Encode the query parameter directly
    const query = q ? encodeURIComponent(q.trim()) : "";
    const url = `/anime?q=${query}`;

    // Perform the redirect
    redirect(url);
  }

  return (
    <div>
      <form action={searchAnime}>
        <div className="flex flex-col gap-3">
          <div className="flex">
            <Input
              className=""
              id="q"
              name="q"
              placeholder="Search event"
            />
          </div>
          <Button className="bg-primary" type="submit">
            Search Anime
          </Button>
        </div>
      </form>
    </div>
  );
};
