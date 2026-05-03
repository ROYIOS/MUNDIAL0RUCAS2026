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

function money(n: number) {
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function directions(origin: string, destination: string) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
}

export default function TripView({ trip, addItem, updateItem, deleteItem, updateTrip }: Props) {
  const [type, setType] = useState<ItemType>("Partido");
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paidBy, setPaidBy] = useState<Person>("Ambos");
  const [date, setDate] = useState("");

  const total = trip.items.reduce((acc, i) => acc + i.cost * i.quantity, 0);
  const paid = trip.items.reduce((acc, i) => acc + (i.paid ? i.cost * i.quantity : 0), 0);
  const pending = total - paid;

  const byPerson = useMemo(() => {
    const split = { Roy: 0, Acompañante: 0 };
    for (const item of trip.items) {
      const amount = item.cost * item.quantity;
      if (item.paidBy === "Roy") split.Roy += amount;
      else if (item.paidBy === "Acompañante") split.Acompañante += amount;
      else {
        split.Roy += amount / 2;
        split.Acompañante += amount / 2;
      }
    }
    return split;
  }, [trip.items]);

  const nextFlight = useMemo(() => {
    const flights = trip.items.filter((item) => item.type === "Vuelo");
    return flights.sort((a, b) => (a.flightDate || "9999").localeCompare(b.flightDate || "9999"))[0];
  }, [trip.items]);

  const nextEvent = useMemo(() => {
    const events = trip.items.filter((item) => item.type !== "Vuelo");
    return events.sort((a, b) => (a.eventDate || "9999").localeCompare(b.eventDate || "9999"))[0];
  }, [trip.items]);

  function handleAdd() {
    addItem({
      id: Date.now(),
      type,
      title: title || type,
      city: trip.city,
      cost: Math.max(0, cost),
      quantity: Math.max(1, quantity),
      paid: false,
      paidBy,
      flightDate: type === "Vuelo" ? date || undefined : undefined,
      eventDate: type !== "Vuelo" ? date || undefined : undefined,
    });
    setTitle("");
    setCost(0);
    setQuantity(1);
    setDate("");
  }

  const baseLocation = trip.airbnbAddress || trip.city;
  const barQuery = trip.barZone || `bares cerca de ${baseLocation}`;

  return (
    <div className="mt-6 space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Separación de gastos</p>
          <p className="mt-2 text-2xl font-black">{money(total)}</p>
          <p className="text-emerald-600 font-bold">Pagado: {money(paid)}</p>
          <p className="text-orange-500 font-bold">Pendiente: {money(pending)}</p>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pagado por Roy</p>
          <p className="mt-2 text-2xl font-black">{money(byPerson.Roy)}</p>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pagado acompañante</p>
          <p className="mt-2 text-2xl font-black">{money(byPerson.Acompañante)}</p>
        </article>

        <article className="rounded-3xl bg-sky-500 p-5 text-white shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-100">Próximo vuelo</p>
          <p className="mt-2 text-xl font-black">{nextFlight ? nextFlight.title : "Sin vuelo"}</p>
          {nextFlight?.flightDate && <p className="text-sm">{nextFlight.flightDate}</p>}
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-sky-100">Próximo evento</p>
          <p className="mt-1 text-lg font-black">{nextEvent ? nextEvent.title : "Sin evento"}</p>
          {nextEvent?.eventDate && <p className="text-sm">{nextEvent.eventDate}</p>}
        </article>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[32px] bg-white p-6 shadow-xl">
          <h2 className="text-3xl font-black">{trip.city}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-6">
            <select className="rounded-xl border p-3" value={type} onChange={(e) => setType(e.target.value as ItemType)}>
              <option>Partido</option><option>Vuelo</option><option>Airbnb</option><option>Bar</option><option>Transporte</option><option>Comida</option><option>Actividad</option><option>Otro</option>
            </select>
            <input className="rounded-xl border p-3" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="number" min="0" className="rounded-xl border p-3" placeholder="Costo" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
            <input type="number" min="1" className="rounded-xl border p-3" placeholder="Cant." value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <input type="date" className="rounded-xl border p-3" value={date} onChange={(e) => setDate(e.target.value)} />
            <button onClick={handleAdd} className="rounded-xl bg-sky-500 text-white font-bold">Agregar</button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <select className="rounded-xl border p-3" value={paidBy} onChange={(e) => setPaidBy(e.target.value as Person)}>
              <option value="Ambos">Paga: Ambos</option>
              <option value="Roy">Paga: Roy</option>
              <option value="Acompañante">Paga: Acompañante</option>
            </select>
            <input className="rounded-xl border p-3" placeholder="Zona de bares (Google)" value={trip.barZone} onChange={(e) => updateTrip("barZone", e.target.value)} />
          </div>

          <div className="mt-6 space-y-3">
            {trip.items.map((item) => (
              <div key={item.id} className="rounded-2xl border p-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <p className="text-xs text-sky-500 font-bold uppercase">{item.type}</p>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  {(item.flightDate || item.eventDate) && <p className="text-sm text-slate-500">{item.flightDate || item.eventDate}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={item.cost} onChange={(e) => updateItem(item.id, "cost", Math.max(0, Number(e.target.value)))} className="w-24 rounded-xl border p-2" />
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Math.max(1, Number(e.target.value)))} className="w-20 rounded-xl border p-2" />
                  <select value={item.paidBy} onChange={(e) => updateItem(item.id, "paidBy", e.target.value as Person)} className="rounded-xl border p-2 text-sm">
                    <option value="Ambos">Ambos</option><option value="Roy">Roy</option><option value="Acompañante">Acompañante</option>
                  </select>
                  <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={item.paid} onChange={(e) => updateItem(item.id, "paid", e.target.checked)} /> Pagado</label>
                  <p className="font-black">{money(item.cost * item.quantity)}</p>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[32px] bg-sky-500 text-white p-6">
          <h3 className="text-2xl font-black">Google Travel API (Maps)</h3>
          <p className="mt-2 text-sm opacity-80">Búsquedas y rutas directas en Google Maps para bares, restaurantes y traslados.</p>
          <div className="mt-4 space-y-2 rounded-xl bg-white/20 p-4 text-sm font-bold">
            <a className="block" href={mapsSearch(barQuery)} target="_blank">🍸 Bares cercanos</a>
            <a className="block" href={mapsSearch(`restaurantes cerca de ${baseLocation}`)} target="_blank">🍽️ Restaurantes cercanos</a>
            <a className="block" href={mapsSearch(`lugares turísticos cerca de ${baseLocation}`)} target="_blank">📍 Lugares turísticos</a>
            <a className="block" href={directions(trip.airportAddress || trip.city, baseLocation)} target="_blank">✈️ Aeropuerto → Hospedaje</a>
            {trip.stadiumAddress && <a className="block" href={directions(baseLocation, trip.stadiumAddress)} target="_blank">🏟️ Hospedaje → Estadio</a>}
          </div>
        </aside>
      </div>
    </div>
  );
}
