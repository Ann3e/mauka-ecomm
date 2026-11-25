export const isValidPin = (v: string) => /^[1-9][0-9]{5}$/.test(v.trim());
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const imageError = (f: { type: string; size: number } | null | undefined): string | null => {
  if (!f) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return "Use a JPG, PNG or WebP image.";
  if (f.size > MAX_IMAGE_BYTES) return "Image must be 3 MB or smaller.";
  return null;
};

export type ListingInput = {
  title: string; collection: "wear" | "restyle" | ""; type: string; material: string; size: string; price: string;
  description: string; condition: string; mainPhoto: boolean; extraPhotos: number;
  flawNote: string; flawPhoto: boolean; usable: string; ideas: string;
};

export function validateListing(v: ListingInput): Record<string, string> {
  const e: Record<string, string> = {};
  if (!v.title.trim()) e["title"] = "Add a title.";
  if (!v.collection) e["collection"] = "Choose Wear or Restyle.";
  if (!v.type) e["type"] = "Choose a garment type.";
  if (!v.material) e["material"] = "Choose a material.";
  if (!v.size.trim()) e["size"] = "Add the listed size.";
  const n = Number(v.price);
  if (!v.price.trim() || !Number.isFinite(n) || n <= 0) e["price"] = "Price must be a positive amount in ₹.";
  if (!v.description.trim()) e["description"] = "Describe the garment.";
  if (!v.condition.trim()) e["condition"] = "Add your condition notes.";
  if (!v.mainPhoto) e["mainPhoto"] = "Add a main photo.";
  if (v.extraPhotos > 3) e["extraPhotos"] = "Up to three extra photos.";
  if (v.collection === "restyle") {
    if (v.flawNote.trim().length < 10) e["flawNote"] = "Describe the flaw specifically (where and how big).";
    if (!v.flawPhoto) e["flawPhoto"] = "Restyle listings need a close-up photo of the flaw.";
    if (!v.usable.trim()) e["usable"] = "Say which parts are still usable.";
  }
  return e;
}
