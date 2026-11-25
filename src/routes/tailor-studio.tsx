import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, MessageCircle, Scissors, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { btn, field, label } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/tailor-studio")({
  head: () => pageHead("Tailor Studio", "Find nearby tailors and discuss a restyled garment."),
  component: TailorStudio,
});

const tailors = [
  { id: "reform", name: "Reform Studio", city: "Bengaluru", area: "Indiranagar", distance: "1.8 km", specialty: "Denim, patchwork and bags" },
  { id: "thread", name: "Thread & Form", city: "Bengaluru", area: "Koramangala", distance: "3.4 km", specialty: "Alterations and separates" },
  { id: "second-stitch", name: "Second Stitch", city: "Mumbai", area: "Bandra", distance: "2.1 km", specialty: "Saree rework and occasion wear" },
  { id: "unfold", name: "Unfold Textiles", city: "Mumbai", area: "Lower Parel", distance: "4.6 km", specialty: "Upcycled jackets and accessories" },
  { id: "mending", name: "The Mending Room", city: "Delhi", area: "Shahpur Jat", distance: "2.9 km", specialty: "Visible mending and repairs" },
  { id: "baandhani", name: "Baandhani Atelier", city: "Delhi", area: "Hauz Khas", distance: "5.2 km", specialty: "Traditional textiles and restyling" },
];

function TailorStudio() {
  const { tailorChats, sendTailorMessage, user } = useStore();
  const [city, setCity] = useState("Bengaluru");
  const [activeTailor, setActiveTailor] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const nearby = tailors.filter((tailor) => tailor.city === city);
  const active = tailors.find((tailor) => tailor.id === activeTailor);
  const chat = active ? tailorChats.find((item) => item.tailorId === active.id && item.email === (user?.email ?? "guest")) : undefined;

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    if (!active || !draft.trim()) return;
    sendTailorMessage(active.id, draft.trim());
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary"><Scissors className="h-4 w-4" /> Tailor Studio</p>
      <h1 className="mt-4 max-w-4xl font-display text-6xl sm:text-7xl">Turn a piece worth keeping into something made for you.</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Browse nearby independent tailors, share the stain or tear, and discuss the redesign together.</p>

      <div className="mt-8 flex items-center gap-3">
        <label htmlFor="tailor-city" className="text-sm font-medium">Near</label>
        <select id="tailor-city" value={city} onChange={(event) => { setCity(event.target.value); setActiveTailor(null); }} className="h-11 rounded-full border border-input bg-card px-4 outline-none focus:border-primary">
          {["Bengaluru", "Mumbai", "Delhi"].map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-5 md:grid-cols-2">
          {nearby.map((tailor) => (
            <article key={tailor.id} className={cn("rounded-[2rem] border bg-card p-7 transition", activeTailor === tailor.id ? "border-primary shadow-lift" : "border-border")}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-4xl">{tailor.name}</h2>
                  <p className="mt-2 text-muted-foreground">{tailor.specialty}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"><MapPin className="h-3 w-3" /> {tailor.distance}</span>
              </div>
              <p className="mt-4 text-sm">{tailor.area}, {tailor.city}</p>
              <button type="button" onClick={() => setActiveTailor(tailor.id)} className={cn(btn({ variant: "outline", size: "md" }), "mt-6")}>
                <MessageCircle className="h-4 w-4" /> Discuss a redesign
              </button>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-[2rem] border border-border bg-card p-5 shadow-lift">
          {active ? (
            <>
              <div className="border-b border-border pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Chat with</p>
                <h2 className="mt-1 font-display text-3xl">{active.name}</h2>
              </div>
              <div className="mt-4 max-h-72 min-h-52 space-y-3 overflow-y-auto">
                {!chat?.messages.length && <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">Tell the tailor about the garment, the flaw, and the design you have in mind.</p>}
                {chat?.messages.map((message) => (
                  <div key={message.id} className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm", message.from === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary")}>{message.text}</div>
                ))}
              </div>
              <form onSubmit={send} className="mt-4 flex gap-2">
                <label htmlFor="tailor-message" className="sr-only">Message</label>
                <input id="tailor-message" value={draft} onChange={(event) => setDraft(event.target.value)} className={field} placeholder="Describe your idea..." />
                <button type="submit" aria-label="Send message" className={btn({ size: "icon" })}><Send className="h-4 w-4" /></button>
              </form>
            </>
          ) : (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <MessageCircle className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-3 font-display text-3xl">Choose a tailor</p>
                <p className="mt-2 text-sm text-muted-foreground">A chat will open beside their profile.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
