"use client";

import { useState } from "react";
import CityTabs from "../components/CityTabs";
import TripView from "../components/TripView";
import { useTrips } from "../lib/store";
import { Item, Trip } from "../types/trip";

function money(n: number) {
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

export default function Home() {
  const { trips, addItem, updateItem, deleteItem, updateTrip } = useTrips();
  const [activeCity, setActiveCity] = useState("Dallas");

  if (!trips.length) {
    return (
      <main className="min-h-screen bg-[#eef6ff] p-6 text-slate-900">
        Cargando...
      </main>
    );
  }

  const current = trips.find((trip) => trip.city === activeCity) || trips[0];
  const travelers = 2;
  const totalTrip = trips.reduce(
    (tripAcc, trip) =>
      tripAcc + trip.items.reduce((itemAcc, item) => itemAcc + item.cost * item.quantity, 0),
    0
  );
  const paidTrip = trips.reduce(
    (tripAcc, trip) =>
      tripAcc +
      trip.items.reduce(
        (itemAcc, item) => itemAcc + (item.paid ? item.cost * item.quantity : 0),
        0
      ),
    0
  );
  const pendingTrip = totalTrip - paidTrip;

  return (
    <main className="min-h-screen bg-[#eef6ff] p-5 text-slate-900 md:p-8">
      <section className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[40px] bg-white shadow-xl shadow-sky-100">
          <div className="relative bg-gradient-to-br from-sky-100 via-white to-cyan-100 p-8 md:p-12">
            <div className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-sky-300/40 blur-3xl" />
            <div className="absolute bottom-[-120px] left-[20%] h-[280px] w-[280px] rounded-full bg-cyan-200/50 blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-500">
                Mundial 2026
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.07em] text-slate-950 md:text-7xl">
                Tu plataforma de viaje.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                Organiza por ciudad tus vuelos, Airbnb, partidos, rutas,
                lugares para salir y gastos compartidos.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-4">
                <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Total viaje
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {money(totalTrip)}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Por persona
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {money(totalTrip / travelers)}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Pagado
                  </p>
                  <p className="mt-2 text-2xl font-black text-emerald-600">
                    {money(paidTrip)}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Pendiente
                  </p>
                  <p className="mt-2 text-2xl font-black text-orange-500">
                    {money(pendingTrip)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6">
          <CityTabs
            cities={trips.map((trip) => trip.city)}
            active={current.city}
            setActive={setActiveCity}
          />
        </div>

        <TripView
          trip={current}
          addItem={(item: Item) => addItem(current.city, item)}
          updateItem={(id: number, field: keyof Item, value: any) =>
            updateItem(current.city, id, field, value)
          }
          deleteItem={(id: number) => deleteItem(current.city, id)}
          updateTrip={(field: keyof Trip, value: string) =>
            updateTrip(current.city, field, value)
          }
          saveRoute={() => {}}
          deleteRoute={() => {}}
          saveRecommendedPlaces={() => {}}
        />
      </section>
    </main>
  );
}
