import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, Plus, Sparkles, X } from "lucide-react";
import { pageHead } from "@/lib/head";
import { btn, field, label } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";
import tee from "@/assets/tee.jpg";
import shirt from "@/assets/shirt.jpg";
import jeans from "@/assets/jeans-wear.jpg";
import hero from "@/assets/hero.jpg";
import kurta from "@/assets/kurta.jpg";
import saree from "@/assets/saree.jpg";
import dupatta from "@/assets/dupatta.jpg";
import blazer from "@/assets/blazer.jpg";
import lehenga from "@/assets/lehenga.jpg";
import dress from "@/assets/dress.jpg";

export const Route = createFileRoute("/re-imagine")({
  head: () => pageHead("Re-imagine", "Discover new ways to style the clothes already in your wardrobe."),
  component: ReImagine,
});

type Look = { name: string; note: string };
type BoardItem = { id: string; name: string; image: string; looks: Look[]; source: "Curated" | "Your board" };

const curated: BoardItem[] = [
  { id: "tee-1", name: "One cotton tee, four ways", image: tee, source: "Curated", looks: [{ name: "Front knot", note: "Tie at the waist with high-rise denim." }, { name: "Half tuck", note: "Tuck one side into a flowing skirt." }, { name: "Layered base", note: "Wear under a slip dress or dungarees." }, { name: "Rolled sleeve", note: "Add a belt and tailored trousers." }] },
  { id: "shirt-1", name: "One white shirt, four moods", image: shirt, source: "Curated", looks: [{ name: "Open layer", note: "Wear unbuttoned over a tank." }, { name: "Waist tie", note: "Knot the hem over a long skirt." }, { name: "One shoulder", note: "Unbutton the collar and drape asymmetrically." }, { name: "Soft tuck", note: "Tuck into relaxed trousers with a belt." }] },
  { id: "denim-1", name: "Denim jacket, day to night", image: hero, source: "Curated", looks: [{ name: "Classic layer", note: "Layer over a kurta and straight pants." }, { name: "Shoulder drape", note: "Drape over a dress without putting your arms in." }, { name: "Belted shape", note: "Add a belt over the jacket for shape." }, { name: "Evening contrast", note: "Pair with a silk saree or a slip skirt." }] },
  { id: "saree-1", name: "One saree, four occasions", image: saree, source: "Curated", looks: [{ name: "Classic pleats", note: "Keep it traditional with a fitted blouse." }, { name: "Belted drape", note: "Add a slim belt over the pleats." }, { name: "Jacket layer", note: "Layer a cropped jacket over the blouse." }, { name: "Contemporary drape", note: "Try a dhoti-style drape with a long shirt." }] },
  { id: "kurta-1", name: "One kurta, four silhouettes", image: kurta, source: "Curated", looks: [{ name: "Straight pants", note: "A clean everyday pairing." }, { name: "Denim mix", note: "Wear open over a tee and jeans." }, { name: "Skirt layer", note: "Add a long skirt for a festive silhouette." }, { name: "Waist definition", note: "Use a fabric belt or dupatta tie." }] },
  { id: "dupatta-1", name: "One dupatta, four drapes", image: dupatta, source: "Curated", looks: [{ name: "Classic shoulder", note: "Balance both ends across the shoulders." }, { name: "Cape drape", note: "Pin at the shoulders over a simple top." }, { name: "Head wrap", note: "Style as a soft headscarf." }, { name: "Waist sash", note: "Tie over a dress as a sash." }] },
  { id: "jeans-1", name: "Straight jeans, four outfits", image: jeans, source: "Curated", looks: [{ name: "White tee", note: "A timeless weekend uniform." }, { name: "Kurta mix", note: "Add a short kurta and sandals." }, { name: "Shirt polish", note: "Pair with a tucked shirt and loafers." }, { name: "Festive contrast", note: "Style with silk and statement jewellery." }] },
  { id: "blazer-1", name: "One blazer, four layers", image: blazer, source: "Curated", looks: [{ name: "Over a tee", note: "Relax the tailoring with a cotton tee." }, { name: "Saree layer", note: "Wear as a modern jacket over a saree." }, { name: "Belted waist", note: "Use a belt to create a dress-like shape." }, { name: "Shoulder styling", note: "Drape over a dress for an easy layer." }] },
  { id: "lehenga-1", name: "One lehenga, four rewears", image: lehenga, source: "Curated", looks: [{ name: "Original set", note: "Wear the matching blouse for an occasion." }, { name: "White shirt", note: "Pair the skirt with a crisp shirt." }, { name: "Crop top", note: "Style with a simple fitted top." }, { name: "Layered kurta", note: "Add a long kurta as an open layer." }] },
  { id: "dress-1", name: "One dress, four layers", image: dress, source: "Curated", looks: [{ name: "Solo simplicity", note: "Keep the dress as the focal piece." }, { name: "Shirt over", note: "Layer an open shirt at the waist." }, { name: "Kurta underneath", note: "Add a fine kurta layer for coverage." }, { name: "Jacket finish", note: "Add denim or a blazer for structure." }] },
  { id: "saree-2", name: "Silk saree, four styling notes", image: saree, source: "Curated", looks: [{ name: "Contrast blouse", note: "Choose a contrasting solid colour." }, { name: "High-neck layer", note: "Add a high-neck blouse for a clean line." }, { name: "Statement belt", note: "Secure the pallu with a crafted belt." }, { name: "Jacketed pallu", note: "Layer a short jacket over the blouse." }] },
  { id: "shirt-2", name: "One shirt, four Indian-western mixes", image: shirt, source: "Curated", looks: [{ name: "Over a kurta", note: "Wear open as a light outer layer." }, { name: "With a saree", note: "Try as a contemporary blouse alternative." }, { name: "With a lehenga", note: "Tuck into a skirt for a new occasion look." }, { name: "Sleeve roll", note: "Pair with denim and roll the cuffs." }] },
];

const boardKey = "mauka-re-imagine-board";

function ReImagine() {
  const [board, setBoard] = useState<BoardItem[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [garmentName, setGarmentName] = useState("");
  const [garmentImage, setGarmentImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(boardKey);
      if (saved) setBoard(JSON.parse(saved) as BoardItem[]);
    } catch (loadError) {
      console.error("Could not load the Re-imagine board.", loadError);
    }
  }, []);

  const saveBoard = (items: BoardItem[]) => {
    setBoard(items);
    try {
      localStorage.setItem(boardKey, JSON.stringify(items));
    } catch (saveError) {
      console.error("Could not save the Re-imagine board.", saveError);
      setError("Your browser storage is full. Remove a saved look and try again.");
    }
  };

  const uploadGarment = (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 1_200_000) {
      setError("Choose an image under 1.2 MB so it can be saved to your styling board.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setGarmentImage(String(reader.result));
    reader.onerror = () => setError("Could not read the image. Please try another file.");
    reader.readAsDataURL(file);
  };

  const addToBoard = (event: React.FormEvent) => {
    event.preventDefault();
    if (!garmentName.trim() || !garmentImage) {
      setError("Add a garment name and photo first.");
      return;
    }
    saveBoard([{
      id: `own-${Date.now()}`,
      name: garmentName.trim(),
      image: garmentImage,
      source: "Your board",
      looks: [
        { name: "Mock suggestion · layered", note: "Try it as a base layer under an open shirt or jacket." },
        { name: "Mock suggestion · waist styling", note: "Add a belt or a front knot to change the silhouette." },
        { name: "Mock suggestion · occasion mix", note: "Pair with a traditional or tailored piece already in your wardrobe." },
      ],
    }, ...board]);
    setFormOpen(false);
    setGarmentName("");
    setGarmentImage("");
    setError("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="grid gap-8 rounded-[2rem] bg-hero p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary"><Sparkles className="h-4 w-4" /> Re-imagine</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl sm:text-7xl">One outfit.<br /><em className="text-primary">More ways to be you.</em></h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Keep the clothes you love. Discover fresh ways to drape, layer, tuck and restyle them.</p>
        </div>
        <button type="button" onClick={() => setFormOpen((isOpen) => !isOpen)} className={btn({ size: "lg" })}><Plus className="h-5 w-5" /> STYLE MY OWN OUTFIT</button>
      </header>

      {formOpen && (
        <form onSubmit={addToBoard} className="reveal mt-8 rounded-[2rem] border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="font-display text-4xl">Add to your styling board</h2><p className="mt-2 text-sm text-muted-foreground">These are curated mock suggestions, not AI-generated results.</p></div>
            <button type="button" aria-label="Close upload form" onClick={() => setFormOpen(false)} className="press grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="garment-name" className={label}>Garment name or type</label><input id="garment-name" value={garmentName} onChange={(event) => setGarmentName(event.target.value)} className={field} placeholder="Black halter top, silk dupatta..." required /></div>
            <div><label htmlFor="garment-image" className={label}>Upload your garment</label><label htmlFor="garment-image" className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 text-sm"><ImagePlus className="h-5 w-5 text-primary" />{garmentImage ? "Photo ready" : "Choose image (up to 1.2 MB)"}<input id="garment-image" type="file" accept="image/*" className="sr-only" onChange={(event) => uploadGarment(event.target.files?.[0])} /></label></div>
          </div>
          {garmentImage && <img src={garmentImage} alt="Garment to style" className="mt-4 h-36 w-28 rounded-xl object-cover" />}
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
          <button type="submit" className={cn(btn({ size: "md" }), "mt-5")}>Add to my board <Sparkles className="h-4 w-4" /></button>
        </form>
      )}

      {board.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-4xl">Your styling board</h2>
          <p className="mt-2 text-sm text-muted-foreground">Saved in this browser. Suggestions are mock styling prompts, not generated images.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {board.map((item) => <Moodboard key={item.id} item={item} onRemove={() => saveBoard(board.filter((saved) => saved.id !== item.id))} />)}
          </div>
        </section>
      )}

      <section className="mt-14">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Curated examples</p>
          <h2 className="mt-3 font-display text-5xl">The same piece, styled differently</h2>
          <p className="mt-3 text-muted-foreground">Twelve outfit moodboards with styling notes. Each board keeps the featured garment as the anchor and explores new combinations around it.</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {curated.map((item) => <Moodboard key={item.id} item={item} />)}
        </div>
      </section>
    </div>
  );
}

function Moodboard({ item, onRemove }: { item: BoardItem; onRemove?: () => void }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-border bg-card">
      <div className="grid grid-cols-2 gap-1 bg-card p-1 sm:grid-cols-4">
        <figure className="relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-[1.4rem] bg-secondary sm:col-span-2">
          <img src={item.image} alt={`${item.name} original garment`} className="h-full w-full object-cover" />
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-card/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Original</figcaption>
        </figure>
        {item.looks.map((look, index) => (
          <figure key={look.name} className={cn("relative aspect-square overflow-hidden rounded-xl", ["bg-wear", "bg-restyle", "bg-secondary"][index % 3])}>
            <img src={item.image} alt={`${item.name}: ${look.name}`} className={cn("h-full w-full object-cover opacity-90", index === 1 && "scale-110 object-[60%_center]", index === 2 && "scale-125 object-[35%_center]", index === 3 && "scale-110 object-top")} />
            <figcaption className="absolute inset-x-1 bottom-1 rounded-full bg-card/90 px-2 py-1 text-center text-[9px] font-bold leading-tight">{look.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div><span className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.source}</span><h3 className="mt-1 font-display text-2xl">{item.name}</h3></div>
          {onRemove && <button type="button" onClick={onRemove} aria-label={`Remove ${item.name} from board`} className="press grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {item.looks.map((look) => <p key={look.name} className="text-sm"><strong>{look.name}.</strong> <span className="text-muted-foreground">{look.note}</span></p>)}
        </div>
      </div>
    </article>
  );
}
