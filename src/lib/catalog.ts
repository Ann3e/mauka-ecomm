import hero from "@/assets/hero.jpg";
import jeansWear from "@/assets/jeans-wear.jpg";
import jeansTorn from "@/assets/jeans-torn.jpg";
import jeansTornFlaw from "@/assets/jeans-torn-flaw.jpg";
import kurta from "@/assets/kurta.jpg";
import saree from "@/assets/saree.jpg";
import sareeFlaw from "@/assets/saree-flaw.jpg";
import tee from "@/assets/tee.jpg";
import shirt from "@/assets/shirt.jpg";
import dupatta from "@/assets/dupatta.jpg";
import blazer from "@/assets/blazer.jpg";
import blazerFlaw from "@/assets/blazer-flaw.jpg";
import lehenga from "@/assets/lehenga.jpg";
import dress from "@/assets/dress.jpg";

export const heroImage = hero;

export type Collection = "wear" | "restyle";
export type Photo = { src: string; label: string };
export type Product = {
  id: string;
  title: string;
  collection: Collection;
  type: string;
  material: string;
  size: string;
  price: number;
  description: string;
  condition: string;
  photos: Photo[];
  flawPhoto?: Photo;
  flawNote?: string;
  usable?: string;
  ideas?: string;
  sold?: boolean;
  createdAt: number;
  sample?: boolean;
  sellerEmail?: string;
};

export const GARMENT_TYPES = ["Jeans", "Shirt", "T-shirt", "Kurta", "Saree", "Dupatta", "Blazer", "Lehenga", "Dress"];
export const MATERIALS = ["Cotton denim", "Cotton", "Silk", "Chanderi", "Wool", "Viscose"];
export const SIZES = ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "One size"];

const d = (days: number) => Date.UTC(2026, 10, 25) - days * 86400000;

export const SEED: Product[] = [
  {
    id: "straight-jeans", title: "Straight-leg blue jeans", collection: "wear", type: "Jeans", material: "Cotton denim", size: "32", price: 890,
    description: "Mid-blue, five-pocket straight-leg jeans with a regular rise and a button fly.",
    condition: "Gently worn. Light fading on the thighs, no tears, stains or repairs. Hems are original.",
    photos: [{ src: jeansWear, label: "Front" }, { src: jeansWear, label: "Waistband detail (crop)" }], createdAt: d(1), sample: true,
  },
  {
    id: "torn-knee-jeans", title: "Blue jeans with torn knees", collection: "restyle", type: "Jeans", material: "Cotton denim", size: "30", price: 390,
    description: "Light-wash straight jeans with contrast stitching and five pockets.",
    condition: "Worn often. Both knees are torn through and the threads are fraying. No stains.",
    flawNote: "Both knees are torn, roughly 8 cm across each.",
    usable: "Both knees are torn. The back panels and pockets are intact, as are the waistband and hems.",
    ideas: "Patchwork pouch from the back panels, pocket appliqués for a tote, or a denim bag panel.",
    photos: [{ src: jeansTorn, label: "Front" }], flawPhoto: { src: jeansTornFlaw, label: "Flaw close-up: torn knee (crop)" }, createdAt: d(2), sample: true,
  },
  {
    id: "indigo-kurta", title: "Indigo block-print kurta", collection: "wear", type: "Kurta", material: "Cotton", size: "M", price: 650,
    description: "Hand block-printed indigo kurta with a mandarin collar and side slits.",
    condition: "Worn a few times. Colour is even, all buttons present, no marks.",
    photos: [{ src: kurta, label: "Front" }], createdAt: d(3), sample: true,
  },
  {
    id: "zari-saree", title: "Silk saree with a torn border", collection: "restyle", type: "Saree", material: "Silk", size: "One size", price: 1450,
    description: "Deep purple silk saree with a woven gold zari border and pallu.",
    condition: "Stored for years. A small tear on the border near one end; the body has no stains.",
    flawNote: "A 4 cm tear along the zari border, about 30 cm from the end.",
    usable: "About 5 metres of the body and the full pallu are intact.",
    ideas: "Cushion covers, a cropped jacket, or zari trim for a blouse.",
    photos: [{ src: saree, label: "Folded" }], flawPhoto: { src: sareeFlaw, label: "Flaw close-up: border tear (crop)" }, createdAt: d(4), sample: true,
  },
  {
    id: "white-tee", title: "Classic white cotton tee", collection: "wear", type: "T-shirt", material: "Cotton", size: "L", price: 390,
    description: "Heavyweight white crew-neck tee with a relaxed fit.",
    condition: "Washed but barely worn. Neckline holds its shape, no yellowing.",
    photos: [{ src: tee, label: "Flat lay" }], createdAt: d(5), sample: true,
  },
  {
    id: "oxford-shirt", title: "Pale blue oxford shirt", collection: "wear", type: "Shirt", material: "Cotton", size: "M", price: 690,
    description: "Button-down oxford shirt with a chest pocket and curved hem.",
    condition: "Lightly worn. Collar points are crisp; one spare button included.",
    photos: [{ src: shirt, label: "On hanger" }], createdAt: d(6), sample: true, sold: true,
  },
  {
    id: "chanderi-dupatta", title: "Mustard chanderi dupatta", collection: "wear", type: "Dupatta", material: "Chanderi", size: "One size", price: 540,
    description: "Sheer mustard chanderi dupatta with a fine woven edge.",
    condition: "Worn twice for functions. No pulls or snags.",
    photos: [{ src: dupatta, label: "Draped" }], createdAt: d(7), sample: true,
  },
  {
    id: "wool-blazer", title: "Brown wool blazer, stained lapel", collection: "restyle", type: "Blazer", material: "Wool", size: "L", price: 990,
    description: "Single-breasted vintage wool blazer with notch lapels and flap pockets.",
    condition: "Structure is good, lining intact. A faded stain on the left lapel did not come out with dry cleaning.",
    flawNote: "A faded 3 cm stain on the left lapel.",
    usable: "Back panel, sleeves and both flap pockets are clean wool.",
    ideas: "Re-cut as a waistcoat, or use the wool for a winter bag.",
    photos: [{ src: blazer, label: "On hanger" }], flawPhoto: { src: blazerFlaw, label: "Flaw close-up: lapel stain (crop)" }, createdAt: d(8), sample: true,
  },
  {
    id: "emerald-lehenga", title: "Emerald embroidered lehenga", collection: "wear", type: "Lehenga", material: "Silk", size: "S", price: 3200,
    description: "Flared emerald lehenga skirt with thread and sequin embroidery.",
    condition: "Worn once at a wedding. All sequins intact, waist drawstring included.",
    photos: [{ src: lehenga, label: "Flat lay" }], createdAt: d(9), sample: true,
  },
  {
    id: "floral-midi", title: "Terracotta floral midi dress", collection: "wear", type: "Dress", material: "Viscose", size: "S", price: 820,
    description: "Floaty midi dress with a small floral print and short sleeves.",
    condition: "Worn a handful of times. Slight softening of the fabric, no marks.",
    photos: [{ src: dress, label: "On hanger" }], createdAt: d(10), sample: true,
  },
];

export function allPhotos(p: Product): Photo[] {
  return p.flawPhoto ? [...p.photos, p.flawPhoto] : p.photos;
}

export function relatedProducts(current: Product, pool: Product[], isSold: (p: Product) => boolean, limit = 4): Product[] {
  return pool
    .filter((p) => p.id !== current.id && !isSold(p))
    .map((p) => ({ p, score: (p.type === current.type ? 3 : 0) + (p.collection === current.collection ? 2 : 0) + (p.material === current.material ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || b.p.createdAt - a.p.createdAt)
    .slice(0, limit)
    .map((x) => x.p);
}

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
export const DELIVERY_FEE = 79;
