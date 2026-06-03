import type { Asmrtist } from "@/features/asmr/types";

export function getAsmrtistId(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const asmrtists: Asmrtist[] = [
  { id: "asmr-bakery", name: "ASMR Bakery" },
  { id: "asmr-bellingham", name: "ASMR Bellingham" },
  { id: "asmr-glow", name: "ASMR Glow" },
  { id: "asmr-zeitgeist", name: "ASMR Zeitgeist" },
  { id: "atmosphere", name: "ATMOSPHERE" },
  { id: "celaines-asmr", name: "Celaine's ASMR" },
  { id: "gentle-whispering-asmr", name: "Gentle Whispering ASMR" },
  { id: "gibi-asmr", name: "Gibi ASMR" },
  { id: "goodnight-moon", name: "Goodnight Moon" },
  { id: "jojos-asmr", name: "Jojo's ASMR" },
  { id: "latte-asmr", name: "Latte ASMR" },
  { id: "lattecat", name: "LatteCat" },
  { id: "luna-bloom-asmr", name: "Luna Bloom ASMR" },
  { id: "moonlight-cottage-asmr", name: "Moonlight Cottage ASMR" },
  { id: "southernasmr-sounds", name: "SouthernASMR Sounds" },
  { id: "tingting-asmr", name: "Tingting ASMR" },
  { id: "whispersred-asmr", name: "WhispersRed ASMR" },
];

export const asmrtistById = new Map(asmrtists.map((asmrtist) => [asmrtist.id, asmrtist]));
export const asmrtistByName = new Map(asmrtists.map((asmrtist) => [asmrtist.name, asmrtist]));
