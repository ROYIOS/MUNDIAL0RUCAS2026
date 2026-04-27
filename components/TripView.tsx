"use client";

import { useState } from "react";
import { Item, ItemType } from "../types/trip";

type Props = {
  city: string;
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (id: number, updates: Partial<Item>) => void;
  deleteItem: (id: number) => void;
};

const stadiums: Record<number, { name: string; address: string }> = {
  80: { name: "Mercedes-Benz Stadium", address: "Atlanta, GA" },
  81: { name: "NRG Stadium", address: "Houston, TX" },
  82: { name: "AT&T Stadium", address: "Arlington, TX" },
};

function money(n: number) {
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

export default function TripView({
  city,
  items,
  addItem,
  updateItem,
  deleteItem,
}: Props) {
  const [type, setType] = useState<ItemType>("Partido");
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(0);
  const [match, setMatch] = useState<number | "">("");
  const [address, setAddress] = useState("");

  const total = items.reduce((acc, i) => acc + i.cost * i.quantity, 0);

  function handleAdd() {
    let finalAddress = address;
    let stadiumName = "";

    if (type === "Partido" && match && stadiums[match]) {
      finalAddress = stadiums[match].address;
      stadiumName = stadiums[match].name;
    }

    addItem({
      id: Date.now(),
      type,
      title: title || type,
      city,
      cost,
      quantity: 1,
      matchNumber: typeof match === "number" ? match : undefined,
      stadium: stadiumName || undefined,
      stadiumAddress: type === "Partido" ? finalAddress : undefined,
      airbnbAddress: type === "Airbnb" ? finalAddress : undefined,
      paid: false,
      paidBy: "Ambos",
    });

    setTitle("");
    setCost(0);
    setMatch("");
    setAddress("");
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* LEFT */}
      <div className="rounded-[32px] bg-white p-6 shadow-xl">
        <h2 className="text-3xl font-black">{city}</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            className="rounded-xl border p-3"
            value={type}
            onChange={(e) => setType(e.target.value as ItemType)}
          >
            <option>Partido</option>
            <option>Vuelo</option>
            <option>Airbnb</option>
            <option>Bar</option>
          </select>

          <input
            className="rounded-xl border p-3"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            className="rounded-xl border p-3"
            placeholder="Costo"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />

          <button
            onClick={handleAdd}
            className="rounded-xl bg-sky-500 text-white font-bold"
          >
            Agregar
          </button>
        </div>

        {type === "Partido" && (
          <input
            type="number"
            placeholder="Número de partido"
            className="mt-3 w-full rounded-xl border p-3"
            value={match}
            onChange={(e) => setMatch(Number(e.target.value))}
          />
        )}

        {type === "Airbnb" && (
          <input
            placeholder="Pega link o dirección"
            className="mt-3 w-full rounded-xl border p-3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}

        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-xs text-sky-500 font-bold uppercase">
                  {item.type}
                </p>
                <h3 className="text-xl font-black">{item.title}</h3>

                {item.matchNumber && (
                  <p className="text-sm text-gray-500">
                    Partido #{item.matchNumber} · {item.stadiumAddress}
                  </p>
                )}

                {item.airbnbAddress && (
                  <input
                    value={item.airbnbAddress}
                    onChange={(e) => updateItem(item.id, { airbnbAddress: e.target.value })}
                    className="mt-2 w-full rounded-xl border p-2 text-sm text-slate-700"
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={item.cost}
                  onChange={(e) =>
                    updateItem(item.id, { cost: Number(e.target.value) })
                  }
                  className="w-24 rounded-xl border p-2"
                />

                <p className="font-black">{money(item.cost)}</p>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-2xl font-black">
          Total: {money(total)}
        </div>
      </div>

      <div className="rounded-[32px] bg-sky-500 text-white p-6">
        <h3 className="text-2xl font-black">Rutas</h3>
        <p className="mt-2 text-sm opacity-80">
          Próximo paso: conectar rutas reales con Google Maps
        </p>

        <div className="mt-4 bg-white/20 p-4 rounded-xl">
          Aeropuerto → Airbnb  
          Airbnb → Estadio  
          Airbnb → Bares
        </div>
      </div>
    </div>
  );
}
