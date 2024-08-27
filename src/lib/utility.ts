'use client'

export  function removeNumberFromString(inputString: string | undefined) {
    console.log(inputString)
  if (typeof inputString === "string") {
    return inputString.replace(/-\d+$/, "");
  } else {
    throw new TypeError("The input provided is not a valid string.");
  }
}

export const savedBookAnime = (anime: any) => {
  // Step 1: Retrieve the existing list from localStorage
  const existingAnimeList = JSON.parse(localStorage.getItem("bookedAnime") || "[]");

  // Step 2: Check if the existing data is an array; if not, initialize it as an array
  const animeList = Array.isArray(existingAnimeList) ? existingAnimeList : [];

  // Optional: Debugging output
  // console.log("Current anime list:", animeList);

  // Step 3: Append the new anime to the array if it's not already present
  animeList.push(anime);

  // Optional: Debugging output
  // console.log("Updated anime list with new entry:", animeList);

  // Step 4: Save the updated array back to localStorage
  localStorage.setItem("bookedAnime", JSON.stringify(animeList));
};

