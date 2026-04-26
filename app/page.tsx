"use client";

import { useState } from "react";
import CityTabs from "../components/CityTabs";
import TripView from "../components/TripView";
import { useTrips } from "../lib/store";

export default function Home() {
  const { trips, addItem } = useTrips();
  const [activeCity, setActiveCity] = useState("Dallas");

  if (!trips.length) {
    return (
      <main className="min-h-screen bg-[#eef6ff] p-6 text-slate-900">
        Cargando...
      </main>
    );
  }

  const current = trips.find((trip) => trip.city === activeCity) || trips[0];

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
          city={current.city}
          items={current.items}
          addItem={() =>
            addItem(current.city, {
              id: Date.now(),
              type: "Otro",
              title: "Nuevo gasto",
              city: current.city,
              cost: 0,
              quantity: 1,
              paid: false,
            })
          }
        />
      </section>
    </main>
  );
}