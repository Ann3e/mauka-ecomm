import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus } from "lucide-react";
import { EXCHANGE_LISTINGS } from "@/lib/exchange-listings";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";
import { btn, field, label } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exchange-request/$listingId")({
  head: () => pageHead("Apply to exchange", "Send an exchange request to a clothing owner."),
  component: ExchangeRequestPage,
});

function ExchangeRequestPage() {
  const { listingId } = Route.useParams();
  const { user, createExchangeRequest } = useStore();
  const listing = EXCHANGE_LISTINGS.find((item) => item.id === listingId);
  const [name, setName] = useState(user?.name ?? "");
  const [outfitName, setOutfitName] = useState("");
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [wanted, setWanted] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [photoError, setPhotoError] = useState("");

  if (!listing) {
    return <div className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="font-display text-5xl">This exchange listing isn’t available.</h1><Link to="/re-exchange" className={cn(btn(), "mt-6")}>Back to Re-exchange</Link></div>;
  }

  const selectPhoto = (file: File | undefined) => {
    setPhotoError("");
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setPhotoError("Choose an image under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.onerror = () => setPhotoError("Could not read that image. Please try another.");
    reader.readAsDataURL(file);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photo) {
      setPhotoError("Add a photo of the outfit you’re offering.");
      return;
    }
    createExchangeRequest({
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.image,
      ownerName: listing.ownerName,
      ownerEmail: listing.ownerEmail,
      requesterName: name.trim(),
      outfitName: outfitName.trim(),
      outfitPhoto: photo,
      category,
      size,
      condition,
      description: description.trim(),
      message: message.trim(),
      interestedIn: wanted.trim(),
    });
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/re-exchange" className="inline-flex items-center gap-2 text-sm font-medium hover:underline"><ArrowLeft className="h-4 w-4" />Back to Re-exchange</Link>
      {submitted ? (
        <section className="mx-auto mt-10 max-w-2xl rounded-[2rem] bg-wear p-8 text-wear-foreground sm:p-12">
          <Check className="h-10 w-10" />
          <h1 className="mt-4 font-display text-5xl">Request submitted</h1>
          <p className="mt-4 text-lg">Your exchange request for <strong>{listing.title}</strong> is pending owner approval.</p>
          <p className="mt-3">You can follow the request in the My Exchange Requests section below.</p>
          <Link to="/re-exchange" className={cn(btn({ variant: "ink", size: "lg" }), "mt-7")}>View my requests <ArrowRight className="h-5 w-5" /></Link>
        </section>
      ) : (
        <>
          <header className="mt-8 grid gap-6 rounded-[2rem] border border-border bg-card p-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <img src={listing.image} alt={listing.title} className="aspect-square w-full rounded-2xl object-cover" />
            <div>
              <span className="rounded-full bg-wear px-3 py-1 text-xs font-bold tracking-widest text-wear-foreground">OPEN TO EXCHANGE</span>
              <h1 className="mt-4 font-display text-5xl">{listing.title}</h1>
              <p className="mt-2 text-muted-foreground">Owner: {listing.ownerName} · {listing.category} · Size {listing.size}</p>
              <p className="mt-3 text-sm"><strong>Owner is looking for:</strong> {listing.preferences}</p>
            </div>
          </header>

          <form onSubmit={submit} className="mt-10 rounded-[2rem] border border-border bg-card p-6 sm:p-9">
            <h2 className="font-display text-4xl">Your exchange application</h2>
            <p className="mt-2 text-sm text-muted-foreground">Share the piece you’re offering. Your request stays pending until the owner responds.</p>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div><label htmlFor="requester-name" className={label}>Your name</label><input id="requester-name" required value={name} onChange={(event) => setName(event.target.value)} className={field} /></div>
              <div><label htmlFor="outfit-name" className={label}>Name of your outfit</label><input id="outfit-name" required value={outfitName} onChange={(event) => setOutfitName(event.target.value)} className={field} /></div>
              <div>
                <label htmlFor="outfit-photo" className={label}>Photograph of your outfit</label>
                <label htmlFor="outfit-photo" className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm">
                  <ImagePlus className="h-5 w-5 text-primary" /> {photo ? "Photo added — choose another" : "Choose an image (up to 2 MB)"}
                  <input id="outfit-photo" type="file" accept="image/*" className="sr-only" onChange={(event) => selectPhoto(event.target.files?.[0])} />
                </label>
                {photoError && <p role="alert" className="mt-2 text-sm text-destructive">{photoError}</p>}
                {photo && <img src={photo} alt="Your proposed exchange outfit" className="mt-3 h-32 w-28 rounded-xl object-cover" />}
              </div>
              <div><label htmlFor="category" className={label}>Category</label><input id="category" required value={category} onChange={(event) => setCategory(event.target.value)} className={field} placeholder="Shirt, kurta, dress..." /></div>
              <div><label htmlFor="size" className={label}>Size</label><input id="size" required value={size} onChange={(event) => setSize(event.target.value)} className={field} placeholder="M, 32, one size..." /></div>
              <div><label htmlFor="condition" className={label}>Condition</label><select id="condition" required value={condition} onChange={(event) => setCondition(event.target.value)} className={field}><option value="">Select condition</option><option>Like new</option><option>Very good</option><option>Good</option><option>Visible wear</option></select></div>
              <div><label htmlFor="wanted" className={label}>What kind of outfit would you like to receive?</label><input id="wanted" required value={wanted} onChange={(event) => setWanted(event.target.value)} className={field} placeholder="Color, category, fit..." /></div>
              <div className="md:col-span-2"><label htmlFor="description" className={label}>Outfit description</label><textarea id="description" required value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className={field} placeholder="Describe fabric, fit, condition and any details the owner should know." /></div>
              <div className="md:col-span-2"><label htmlFor="message" className={label}>Optional message to the owner</label><textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className={field} placeholder="Add a note or question..." /></div>
            </div>
            <button type="submit" className={cn(btn({ size: "lg" }), "mt-7 w-full sm:w-auto")}>APPLY REQUEST <ArrowRight className="h-5 w-5" /></button>
          </form>
        </>
      )}
    </div>
  );
}
