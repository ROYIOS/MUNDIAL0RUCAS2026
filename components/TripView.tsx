"use client";

import { useMemo, useState } from "react";
import { Item, ItemType, Person, Trip } from "../types/trip";

type Props = {
  trip: Trip;
  addItem: (item: Item) => void;
  updateItem: (id: number, field: keyof Item, value: any) => void;
  deleteItem: (id: number) => void;
  updateTrip: (field: keyof Trip, value: string) => void;
  saveRoute?: (...args: any[]) => void;
  deleteRoute?: (...args: any[]) => void;
  saveRecommendedPlaces?: (...args: any[]) => void;
};

const money = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

const mapsSearch = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const directions = (o: string, d: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`;

export default function TripView({ trip, addItem, updateItem, deleteItem, updateTrip }: Props) {
  const [type, setType] = useState<ItemType>("Partido");
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paidBy, setPaidBy] = useState<Person>("Ambos");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const total = useMemo(() => trip.items.reduce((a, i) => a + i.cost * i.quantity, 0), [trip.items]);
  const paid = useMemo(() => trip.items.reduce((a, i) => a + (i.paid ? i.cost * i.quantity : 0), 0), [trip.items]);
  const pending = total - paid;

  const split = useMemo(() => {
    const out = { Roy: 0, Acompañante: 0 };
    for (const i of trip.items) {
      const amount = i.cost * i.quantity;
      if (i.paidBy === "Roy") out.Roy += amount;
      else if (i.paidBy === "Acompañante") out.Acompañante += amount;
      else {
        out.Roy += amount / 2;
        out.Acompañante += amount / 2;
      }
    }
    return out;
  }, [trip.items]);

  const nextFlight = useMemo(
    () =>
      trip.items
        .filter((i) => i.type === "Vuelo")
        .sort((a, b) => (a.flightDate || "9999-12-31").localeCompare(b.flightDate || "9999-12-31"))[0],
    [trip.items]
  );

  const nextEvent = useMemo(
    () =>
      trip.items
        .filter((i) => i.type !== "Vuelo")
        .sort((a, b) => (a.eventDate || "9999-12-31").localeCompare(b.eventDate || "9999-12-31"))[0],
    [trip.items]
  );

  const baseLocation = trip.airbnbAddress || trip.city;

  function handleAdd() {
    addItem({
      id: Date.now(),
      type,
      title: title.trim() || type,
      city: trip.city,
      cost: Math.max(0, cost),
      quantity: Math.max(1, quantity),
      paid: false,
      paidBy,
      flightDate: type === "Vuelo" ? date || undefined : undefined,
      eventDate: type !== "Vuelo" ? date || undefined : undefined,
      notes: notes || undefined,
    });

    setTitle("");
    setCost(0);
    setQuantity(1);
    setDate("");
    setNotes("");
    setPaidBy("Ambos");
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Total</p>
          <p className="mt-2 text-2xl font-black">{money(total)}</p>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Pagado</p>
          <p className="mt-2 text-2xl font-black text-emerald-600">{money(paid)}</p>
          <p className="text-xs text-slate-500">Pendiente: {money(pending)}</p>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Roy</p>
          <p className="mt-2 text-2xl font-black">{money(split.Roy)}</p>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Acompañante</p>
          <p className="mt-2 text-2xl font-black">{money(split.Acompañante)}</p>
        </article>

        <article className="rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 p-5 text-white shadow-lg">
          <p className="text-xs uppercase font-bold text-sky-100">Próximos</p>
          <p className="mt-2 text-sm">Vuelo: {nextFlight?.title || "Sin vuelo"}</p>
          <p className="text-xs">{nextFlight?.flightDate || "Sin fecha"}</p>
          <p className="mt-2 text-sm">Evento: {nextEvent?.title || "Sin evento"}</p>
          <p className="text-xs">{nextEvent?.eventDate || "Sin fecha"}</p>
        </article>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <h2 className="text-3xl font-black">{trip.city}</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-6">
            <select className="rounded-xl border p-3" value={type} onChange={(e) => setType(e.target.value as ItemType)}>
              <option>Partido</option><option>Vuelo</option><option>Airbnb</option><option>Bar</option><option>Transporte</option><option>Comida</option><option>Actividad</option><option>Otro</option>
            </select>
            <input className="rounded-xl border p-3" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="number" min="0" className="rounded-xl border p-3" placeholder="Costo" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            <input type="number" min="1" className="rounded-xl border p-3" placeholder="Cant." value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <input type="date" className="rounded-xl border p-3" value={date} onChange={(e) => setDate(e.target.value)} />
            <button onClick={handleAdd} className="rounded-xl bg-sky-500 text-white font-bold">Guardar</button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <select className="rounded-xl border p-3" value={paidBy} onChange={(e) => setPaidBy(e.target.value as Person)}>
              <option value="Ambos">Paga: Ambos</option>
              <option value="Roy">Paga: Roy</option>
              <option value="Acompañante">Paga: Acompañante</option>
            </select>
            <input className="rounded-xl border p-3 md:col-span-2" placeholder="Notas" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="mt-6 space-y-3">
            {trip.items.map((item) => (
              <article key={item.id} className="rounded-2xl border p-4 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold text-sky-600">{item.type}</p>
                    <h3 className="text-lg font-black">{item.title}</h3>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500 font-bold">Eliminar</button>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-6">
                  <input type="number" min="0" value={item.cost} onChange={(e) => updateItem(item.id, "cost", Math.max(0, Number(e.target.value)))} className="rounded-xl border p-2" />
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Math.max(1, Number(e.target.value)))} className="rounded-xl border p-2" />
                  <select value={item.paidBy} onChange={(e) => updateItem(item.id, "paidBy", e.target.value as Person)} className="rounded-xl border p-2">
                    <option value="Ambos">Ambos</option><option value="Roy">Roy</option><option value="Acompañante">Acompañante</option>
                  </select>
                  <label className="rounded-xl border p-2 text-sm"><input type="checkbox" checked={item.paid} onChange={(e) => updateItem(item.id, "paid", e.target.checked)} /> Pagado</label>
                  <input type="date" value={item.type === "Vuelo" ? item.flightDate || "" : item.eventDate || ""} onChange={(e) => updateItem(item.id, item.type === "Vuelo" ? "flightDate" : "eventDate", e.target.value)} className="rounded-xl border p-2" />
                  <div className="rounded-xl border p-2 font-black text-right">{money(item.cost * item.quantity)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl bg-slate-900 p-6 text-white">
          <h3 className="text-2xl font-black">Google tools</h3>
          <div className="mt-4 space-y-2 text-sm font-bold">
            <a className="block rounded-xl bg-white/10 px-3 py-2" href={mapsSearch(trip.barZone || `bares cerca de ${baseLocation}`)} target="_blank">🍸 Bares</a>
            <a className="block rounded-xl bg-white/10 px-3 py-2" href={mapsSearch(`restaurantes cerca de ${baseLocation}`)} target="_blank">🍽️ Restaurantes</a>
            <a className="block rounded-xl bg-white/10 px-3 py-2" href={directions(trip.airportAddress || trip.city, baseLocation)} target="_blank">✈️ Aeropuerto→Hospedaje</a>
          </div>
          <input className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2" value={trip.barZone} onChange={(e) => updateTrip("barZone", e.target.value)} placeholder="Zona de bares" />
        </aside>
      </div>
    </div>
  );
}
