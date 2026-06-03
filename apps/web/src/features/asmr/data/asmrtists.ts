import type { Asmrtist } from "@/features/asmr/types";

export function getAsmrtistId(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const asmrtists: Asmrtist[] = [
  {
    id: "asmr-bakery",
    name: "ASMR Bakery",
    url: "https://www.youtube.com/channel/UCDH70xAv1bBeaCt5Cc7a96A",
  },
  { id: "asmr-bellingham", name: "ASMR Bellingham" },
  {
    id: "asmr-glow",
    name: "ASMR Glow",
    url: "https://www.youtube.com/channel/UCFmL725KKPx2URVPvH3Gp8w",
  },
  {
    id: "asmr-zeitgeist",
    name: "ASMR Zeitgeist",
    url: "https://www.youtube.com/channel/UCzGEGjOCbgv9z9SF71QyI7g",
  },
  {
    id: "atmosphere",
    name: "ATMOSPHERE",
    url: "https://www.youtube.com/channel/UCyiN63Gy-qfgg_KF9qVQZdg",
  },
  {
    id: "celaines-asmr",
    name: "Celaine's ASMR",
    url: "https://www.youtube.com/c/celainesasmr",
  },
  {
    id: "gentle-whispering-asmr",
    name: "Gentle Whispering ASMR",
    url: "https://www.youtube.com/channel/UC6gLlIAnzg7eJ8VuXDCZ_vg",
  },
  {
    id: "gibi-asmr",
    name: "Gibi ASMR",
    url: "https://www.youtube.com/channel/UCE6acMV3m35znLcf0JGNn7Q",
  },
  {
    id: "goodnight-moon",
    name: "Goodnight Moon",
    url: "https://www.youtube.com/channel/UClMJgjg2z_IrRm6J9KrhcuQ",
  },
  {
    id: "jojos-asmr",
    name: "Jojo's ASMR",
    url: "https://www.youtube.com/channel/UCjyi6by44TTH0j_U3vXEGpA",
  },
  {
    id: "latte-asmr",
    name: "Latte ASMR",
    url: "https://www.youtube.com/channel/UCQe2Y7V-C9bNMAcCJCBvzQQ",
  },
  { id: "lattecat", name: "LatteCat" },
  {
    id: "luna-bloom-asmr",
    name: "Luna Bloom ASMR",
    url: "https://www.youtube.com/channel/UCgUBjMqA_IZQVFdEElvPHDA",
  },
  {
    id: "moonlight-cottage-asmr",
    name: "Moonlight Cottage ASMR",
    url: "https://www.youtube.com/channel/UCftD_LCuDAwlPipnM6Uikqw",
  },
  {
    id: "southernasmr-sounds",
    name: "SouthernASMR Sounds",
    url: "https://www.youtube.com/channel/UCpw8ZudbxklOi73pWeI6s9A",
  },
  {
    id: "tingting-asmr",
    name: "Tingting ASMR",
    url: "https://www.youtube.com/channel/UClqNSqnWeOOUVkzcJFj4rBw",
  },
  {
    id: "whispersred-asmr",
    name: "WhispersRed ASMR",
    url: "https://www.youtube.com/@WhispersRedASMR",
  },
];

export const asmrtistById = new Map(asmrtists.map((asmrtist) => [asmrtist.id, asmrtist]));
export const asmrtistByName = new Map(asmrtists.map((asmrtist) => [asmrtist.name, asmrtist]));
