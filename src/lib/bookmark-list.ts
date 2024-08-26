export const savedBookAnime = (anime) => {
  localStorage.setItem("bookedAnime", JSON.stringify(anime));
};
