import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED, DELIVERY_FEE, type Product } from "./catalog";

export type User = { name: string; email: string; password: string };
export const ORDER_STEPS = ["Placed", "Accepted", "Dispatched", "Delivered"] as const;
export type Order = {
  id: string; email: string; items: { id: string; title: string; price: number; photo: string }[];
  subtotal: number; delivery: number; total: number;
  address: { name: string; address: string; city: string; pin: string };
  step: number; history: number[]; placedAt: number;
};

export type ExchangeProposal = {
  id: string;
  email: string;
  offeredProductId: string;
  offeredTitle: string;
  wantedTitle: string;
  description: string;
  city: string;
  status: "Open" | "Accepted";
  createdAt: number;
};

export type ExchangeRequestStatus = "Pending" | "Approved" | "Rejected";
export type ExchangeRequest = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  ownerName: string;
  ownerEmail: string;
  requesterName: string;
  requesterEmail: string;
  outfitName: string;
  outfitPhoto: string;
  category: string;
  size: string;
  condition: string;
  description: string;
  message: string;
  interestedIn: string;
  status: ExchangeRequestStatus;
  createdAt: number;
};

export type SourceRequestStatus = "Pending" | "Accepted" | "Proposal Received" | "Tailor Selected";
export type SourceRequest = {
  id: string;
  email: string;
  sourcePhoto: string;
  material: string;
  inspirationPhoto: string;
  description: string;
  requirements: string;
  status: SourceRequestStatus;
  tailorId?: string;
  tailorName?: string;
  proposedPrice?: number;
  estimatedDays?: number;
  createdAt: number;
};

export type TailorMessage = { id: string; from: "user" | "tailor"; text: string; createdAt: number };
export type TailorChat = { tailorId: string; email: string; messages: TailorMessage[] };

type State = {
  users: User[];
  session: string | null;
  bag: string[];
  listings: Product[];
  orders: Order[];
  exchangeProposals: ExchangeProposal[];
  tailorChats: TailorChat[];
  exchangeRequests: ExchangeRequest[];
  sourceRequests: SourceRequest[];
};
const KEY = "mauka-demo-v1";
const empty: State = { users: [{ name: "Demo Shopper", email: "demo@mauka.in", password: "mauka123" }], session: null, bag: [], listings: [], orders: [], exchangeProposals: [], tailorChats: [], exchangeRequests: [], sourceRequests: [] };

type Ctx = State & {
  ready: boolean;
  products: Product[];
  user: User | null;
  isSold: (p: Product) => boolean;
  addToBag: (id: string) => void;
  removeFromBag: (id: string) => void;
  signIn: (email: string, password: string) => string | null;
  signUp: (u: User) => string | null;
  signOut: () => void;
  addListing: (p: Product) => void;
  placeOrder: (address: Order["address"]) => { order?: Order; soldItems?: Product[] };
  advanceOrder: (id: string) => void;
  createExchangeProposal: (proposal: Omit<ExchangeProposal, "id" | "email" | "status" | "createdAt">) => void;
  acceptExchangeProposal: (id: string) => void;
  sendTailorMessage: (tailorId: string, text: string) => void;
  createExchangeRequest: (request: Omit<ExchangeRequest, "id" | "requesterEmail" | "status" | "createdAt">) => void;
  updateExchangeRequest: (id: string, status: ExchangeRequestStatus) => void;
  createSourceRequest: (request: Omit<SourceRequest, "id" | "email" | "status" | "createdAt">) => void;
  updateSourceRequest: (id: string, update: Partial<Pick<SourceRequest, "status" | "tailorId" | "tailorName" | "proposedPrice" | "estimatedDays">>) => void;
};
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(empty);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...empty, ...JSON.parse(raw) }); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* quota */ } }, [s, ready]);

  const products = useMemo(() => [...s.listings, ...SEED], [s.listings]);
  const soldIds = useMemo(() => new Set(s.orders.flatMap((o) => o.items.map((i) => i.id))), [s.orders]);
  const isSold = useCallback((p: Product) => !!p.sold || soldIds.has(p.id), [soldIds]);
  const user = s.users.find((u) => u.email === s.session) ?? null;

  const value: Ctx = {
    ...s, ready, products, user, isSold,
    addToBag: (id) => setS((x) => (x.bag.includes(id) ? x : { ...x, bag: [...x.bag, id] })),
    removeFromBag: (id) => setS((x) => ({ ...x, bag: x.bag.filter((b) => b !== id) })),
    signIn: (email, password) => {
      const u = s.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!u || u.password !== password) return "Email or password is incorrect.";
      setS((x) => ({ ...x, session: u.email })); return null;
    },
    signUp: (u) => {
      if (s.users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) return "An account with this email already exists.";
      setS((x) => ({ ...x, users: [...x.users, u], session: u.email })); return null;
    },
    signOut: () => setS((x) => ({ ...x, session: null })),
    addListing: (p) => setS((x) => ({ ...x, listings: [p, ...x.listings] })),
    placeOrder: (address) => {
      const items = s.bag.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);
      const soldItems = items.filter(isSold);
      if (soldItems.length) return { soldItems };
      const subtotal = items.reduce((a, p) => a + p.price, 0);
      const order: Order = {
        id: "MK" + Date.now().toString(36).toUpperCase(), email: s.session ?? "", address,
        items: items.map((p) => ({ id: p.id, title: p.title, price: p.price, photo: p.photos[0]?.src ?? "" })),
        subtotal, delivery: DELIVERY_FEE, total: subtotal + DELIVERY_FEE, step: 0, history: [Date.now()], placedAt: Date.now(),
      };
      setS((x) => ({ ...x, orders: [order, ...x.orders], bag: [] }));
      return { order };
    },
    advanceOrder: (id) => setS((x) => ({ ...x, orders: x.orders.map((o) => o.id === id && o.step < 3 ? { ...o, step: o.step + 1, history: [...o.history, Date.now()] } : o) })),
    createExchangeProposal: (proposal) => setS((x) => ({
      ...x,
      exchangeProposals: [{
        ...proposal,
        id: "EX-" + Date.now().toString(36).toUpperCase(),
        email: x.session ?? "guest",
        status: "Open",
        createdAt: Date.now(),
      }, ...x.exchangeProposals],
    })),
    acceptExchangeProposal: (id) => setS((x) => ({
      ...x,
      exchangeProposals: x.exchangeProposals.map((proposal) => proposal.id === id ? { ...proposal, status: "Accepted" } : proposal),
    })),
    sendTailorMessage: (tailorId, text) => setS((x) => {
      const email = x.session ?? "guest";
      const existing = x.tailorChats.find((chat) => chat.tailorId === tailorId && chat.email === email);
      const message: TailorMessage = { id: "MSG-" + Date.now().toString(36), from: "user", text, createdAt: Date.now() };
      const nextChat: TailorChat = existing
        ? { ...existing, messages: [...existing.messages, message] }
        : { tailorId, email, messages: [message] };
      return {
        ...x,
        tailorChats: existing
          ? x.tailorChats.map((chat) => chat.tailorId === tailorId && chat.email === email ? nextChat : chat)
          : [nextChat, ...x.tailorChats],
      };
    }),
    createExchangeRequest: (request) => setS((x) => ({
      ...x,
      exchangeRequests: [{
        ...request,
        id: "ER-" + Date.now().toString(36).toUpperCase(),
        requesterEmail: x.session ?? "guest",
        status: "Pending",
        createdAt: Date.now(),
      }, ...x.exchangeRequests],
    })),
    updateExchangeRequest: (id, status) => setS((x) => ({
      ...x,
      exchangeRequests: x.exchangeRequests.map((request) => request.id === id ? { ...request, status } : request),
    })),
    createSourceRequest: (request) => setS((x) => ({
      ...x,
      sourceRequests: [{
        ...request,
        id: "RS-" + Date.now().toString(36).toUpperCase(),
        email: x.session ?? "guest",
        status: "Pending",
        createdAt: Date.now(),
      }, ...x.sourceRequests],
    })),
    updateSourceRequest: (id, update) => setS((x) => ({
      ...x,
      sourceRequests: x.sourceRequests.map((request) => request.id === id ? { ...request, ...update } : request),
    })),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
