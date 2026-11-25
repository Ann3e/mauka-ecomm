import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus } from "lucide-react";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";
import { btn, field, label } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/re-source-request")({
  head: () => pageHead("Create a design request", "Share your fabric and design inspiration with independent tailors."),
  component: SourceRequestForm,
});

function SourceRequestForm() {
  const { createSourceRequest } = useStore();
  const [sourcePhoto, setSourcePhoto] = useState("");
  const [inspirationPhoto, setInspirationPhoto] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const upload = (file: File | undefined, setImage: (value: string) => void) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 800_000) {
      setError("Choose an image under 800 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.onerror = () => setError("Could not read the image. Please try another.");
    reader.readAsDataURL(file);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sourcePhoto || !inspirationPhoto) {
      setError("Add both a photo of your fabric and an inspiration image.");
      return;
    }
    createSourceRequest({ sourcePhoto, material: material.trim(), inspirationPhoto, description: description.trim(), requirements: requirements.trim() });
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/re-source" className="inline-flex items-center gap-2 text-sm font-medium hover:underline"><ArrowLeft className="h-4 w-4" />Back to Re-source</Link>
      {submitted ? (
        <section className="mt-8 rounded-[2rem] bg-wear p-8 text-wear-foreground sm:p-12">
          <Check className="h-10 w-10" /><h1 className="mt-4 font-display text-5xl">Request shared with the studios</h1>
          <p className="mt-4 text-lg">Your design request is now Pending. Tailors can accept it and send a price and estimated completion time.</p>
          <Link to="/re-source" className={cn(btn({ variant: "ink", size: "lg" }), "mt-7")}>Track my request <ArrowRight className="h-5 w-5" /></Link>
        </section>
      ) : (
        <form onSubmit={submit} className="mt-8 rounded-[2rem] border border-border bg-card p-6 sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Re-source request</p>
          <h1 className="mt-3 font-display text-5xl">Let’s make your fabric new again.</h1>
          <p className="mt-3 text-muted-foreground">This request is for fabric you already own and want to keep transformed—not for damaged clothes listed for resale.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="source-photo" className={label}>Photo of your old saree, fabric or garment</label>
              <label htmlFor="source-photo" className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm"><ImagePlus className="h-5 w-5 text-primary" />{sourcePhoto ? "Fabric image added" : "Choose source image"}<input id="source-photo" type="file" accept="image/*" className="sr-only" onChange={(event) => upload(event.target.files?.[0], setSourcePhoto)} /></label>
              {sourcePhoto && <img src={sourcePhoto} alt="Your source fabric" className="mt-3 h-36 w-28 rounded-xl object-cover" />}
            </div>
            <div>
              <label htmlFor="inspiration-photo" className={label}>Inspiration image of the outfit you want</label>
              <label htmlFor="inspiration-photo" className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm"><ImagePlus className="h-5 w-5 text-primary" />{inspirationPhoto ? "Inspiration image added" : "Choose inspiration image"}<input id="inspiration-photo" type="file" accept="image/*" className="sr-only" onChange={(event) => upload(event.target.files?.[0], setInspirationPhoto)} /></label>
              {inspirationPhoto && <img src={inspirationPhoto} alt="Outfit inspiration" className="mt-3 h-36 w-28 rounded-xl object-cover" />}
            </div>
            <div><label htmlFor="material" className={label}>Material type</label><input id="material" value={material} onChange={(event) => setMaterial(event.target.value)} className={field} placeholder="Silk, cotton, chiffon..." required /></div>
            <div><label htmlFor="requirements" className={label}>Preferred size, fit and tailoring requirements</label><input id="requirements" value={requirements} onChange={(event) => setRequirements(event.target.value)} className={field} placeholder="Size, fit, lining, pockets..." required /></div>
            <div className="md:col-span-2"><label htmlFor="design-description" className={label}>Describe your desired design</label><textarea id="design-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className={field} placeholder="What should the tailor make? Include details like neckline, sleeve, length or occasion." required /></div>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
          <button type="submit" className={cn(btn({ size: "lg" }), "mt-7")}>Send design request <ArrowRight className="h-5 w-5" /></button>
        </form>
      )}
      {!submitted && <p className="mt-4 text-xs text-muted-foreground">Images stay in this browser in this prototype. Keep each image under 800 KB.</p>}
    </div>
  );
}
