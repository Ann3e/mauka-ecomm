import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GARMENT_TYPES, MATERIALS, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { imageError, validateListing } from "@/lib/validation";
import { pageHead } from "@/lib/head";
import { btn, DemoNote, field, FieldError, label } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sell")({
  head: () => pageHead("List an item", "List a pre-loved piece on Mauka as Wear or Restyle."),
  component: Sell,
});

const readFile = (f: File) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); });

function Sell() {
  const { ready, user, addListing } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ title: "", collection: "" as "" | "wear" | "restyle", type: "", material: "", size: "", price: "", description: "", condition: "", flawNote: "", usable: "", ideas: "" });
  const [main, setMain] = useState<string>("");
  const [extras, setExtras] = useState<string[]>([]);
  const [flaw, setFlaw] = useState<string>("");
  const [err, setErr] = useState<Record<string, string>>({});
  if (!ready) return <div className="py-24 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/signin" search={{ redirect: "/sell" }} replace />;

  const pick = async (files: FileList | null, key: string, set: (v: string[]) => void, max = 1) => {
    const list = Array.from(files ?? []);
    if (list.length > max) { setErr((e) => ({ ...e, [key]: `Up to ${max} photos.` })); return; }
    for (const x of list) { const m = imageError(x); if (m) { setErr((e) => ({ ...e, [key]: m })); return; } }
    setErr((e) => { const n = { ...e }; delete n[key]; return n; });
    set(await Promise.all(list.map(readFile)));
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er = { ...validateListing({ ...f, mainPhoto: !!main, extraPhotos: extras.length, flawPhoto: !!flaw }) };
    setErr(er);
    if (Object.keys(er).length || !f.collection) return;
    const id = "u-" + Date.now().toString(36);
    const p: Product = {
      id, title: f.title.trim(), collection: f.collection, type: f.type, material: f.material, size: f.size.trim(), price: Math.round(Number(f.price)),
      description: f.description.trim(), condition: f.condition.trim(), createdAt: Date.now(), sellerEmail: user.email,
      photos: [{ src: main, label: "Main photo" }, ...extras.map((src, i) => ({ src, label: `Extra photo ${i + 1}` }))],
      ...(f.collection === "restyle" ? { flawPhoto: { src: flaw, label: "Flaw close-up" }, flawNote: f.flawNote.trim(), usable: f.usable.trim(), ...(f.ideas.trim() ? { ideas: f.ideas.trim() } : {}) } : {}),
    };
    addListing(p);
    navigate({ to: "/product/$id", params: { id } });
  };
  const txt = (k: keyof typeof f, l: string, area = false, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={k} className={label}>{l}</label>
      {area ? <textarea id={k} rows={3} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={cn(field, err[k] && "border-destructive")} />
        : <input id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={cn(field, err[k] && "border-destructive")} {...props} />}
      <FieldError msg={err[k]} />
    </div>
  );
  const sel = (k: "type" | "material", l: string, opts: string[]) => (
    <div><label htmlFor={k} className={label}>{l}</label>
      <select id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={cn(field, err[k] && "border-destructive")}><option value="">Choose…</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
      <FieldError msg={err[k]} /></div>
  );
  const file = (k: string, l: string, onChange: (fl: FileList | null) => void, multiple = false, preview: string[] = []) => (
    <div><label htmlFor={k} className={label}>{l}</label>
      <input id={k} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} onChange={(e) => onChange(e.target.files)} className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-ink-foreground" />
      {preview.length > 0 && <div className="mt-2 flex gap-2">{preview.map((s, i) => <img key={i} src={s} alt="" className="h-16 w-14 rounded-lg object-cover" />)}</div>}
      <FieldError msg={err[k]} /></div>
  );
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-6xl">List an item</h1>
      <DemoNote className="mt-4">Demo: your listing is saved in this browser only. JPG, PNG or WebP, up to 3 MB each.</DemoNote>
      <form onSubmit={submit} noValidate className="mt-8 space-y-6">
        <fieldset>
          <legend className={label}>Collection</legend>
          <div className="flex gap-3">
            {(["wear", "restyle"] as const).map((c) => (
              <button type="button" key={c} aria-pressed={f.collection === c} onClick={() => setF({ ...f, collection: c })} className={btn({ variant: f.collection === c ? c : "chip" })}>{c === "wear" ? "Wear" : "Restyle"}</button>
            ))}
          </div>
          <FieldError msg={err["collection"]} />
        </fieldset>
        {txt("title", "Title")}
        <div className="grid gap-5 sm:grid-cols-2">{sel("type", "Garment type", GARMENT_TYPES)}{sel("material", "Material", MATERIALS)}</div>
        <div className="grid gap-5 sm:grid-cols-2">{txt("size", "Listed size", false, { placeholder: "e.g. M or 32" })}{txt("price", "Price (₹)", false, { inputMode: "numeric" })}</div>
        {txt("description", "Product description", true)}
        {txt("condition", "Seller’s condition notes", true)}
        {file("mainPhoto", "Main photo", (fl) => pick(fl, "mainPhoto", (v) => setMain(v[0] ?? "")), false, main ? [main] : [])}
        {file("extraPhotos", "Extra photos (up to 3)", (fl) => pick(fl, "extraPhotos", setExtras, 3), true, extras)}
        {f.collection === "restyle" && (
          <div className="reveal space-y-5 rounded-3xl bg-restyle p-6 text-restyle-foreground">
            {txt("flawNote", "The flaw (where and how big)", true)}
            {file("flawPhoto", "Flaw close-up photo", (fl) => pick(fl, "flawPhoto", (v) => setFlaw(v[0] ?? "")), false, flaw ? [flaw] : [])}
            {txt("usable", "Usable parts", true)}
            {txt("ideas", "Ideas to try (optional)", true)}
          </div>
        )}
        <button type="submit" className={cn(btn({ variant: "primary", size: "lg" }), "w-full")}>Publish listing</button>
      </form>
    </div>
  );
}
