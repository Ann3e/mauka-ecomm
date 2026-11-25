import kurta from "@/assets/kurta.jpg";
import tee from "@/assets/tee.jpg";
import shirt from "@/assets/shirt.jpg";
import dupatta from "@/assets/dupatta.jpg";
import blazer from "@/assets/blazer.jpg";
import dress from "@/assets/dress.jpg";

export type ExchangeListing = {
  id: string;
  title: string;
  category: string;
  size: string;
  condition: string;
  preferences: string;
  ownerName: string;
  ownerEmail: string;
  image: string;
};

export const EXCHANGE_LISTINGS: ExchangeListing[] = [
  { id: "swap-indigo-kurta", title: "Indigo block-print kurta", category: "Kurta", size: "M", condition: "Gently worn", preferences: "Open to summer dresses or lightweight shirts", ownerName: "Aarav", ownerEmail: "aarav@example.in", image: kurta },
  { id: "swap-cotton-tee", title: "Classic white cotton tee", category: "T-shirt", size: "L", condition: "Excellent", preferences: "Looking for a cotton kurta or denim shirt", ownerName: "Mira", ownerEmail: "mira@example.in", image: tee },
  { id: "swap-oxford", title: "Pale blue oxford shirt", category: "Shirt", size: "M", condition: "Very good", preferences: "Would love an overshirt or a relaxed kurta", ownerName: "Dev", ownerEmail: "dev@example.in", image: shirt },
  { id: "swap-dupatta", title: "Mustard Chanderi dupatta", category: "Dupatta", size: "One size", condition: "Excellent", preferences: "Interested in a printed stole or cotton shirt", ownerName: "Nisha", ownerEmail: "nisha@example.in", image: dupatta },
  { id: "swap-blazer", title: "Brown wool blazer", category: "Blazer", size: "L", condition: "Good, lightly worn", preferences: "Open to a warm layer or handmade accessories", ownerName: "Kabir", ownerEmail: "kabir@example.in", image: blazer },
  { id: "swap-midi", title: "Terracotta floral midi dress", category: "Dress", size: "S", condition: "Very good", preferences: "Looking for a kurta or a relaxed-fit shirt", ownerName: "Tara", ownerEmail: "tara@example.in", image: dress },
];
