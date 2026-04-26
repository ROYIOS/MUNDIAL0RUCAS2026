"use client";

type Props = {
  cities: string[];
  active: string;
  setActive: (city: string) => void;
};

export default function CityTabs({ cities, active, setActive }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto rounded-[28px] bg-white/70 p-3 shadow-sm backdrop-blur">
      {cities.map((city) => (
        <button
          key={city}
          onClick={() => setActive(city)}
          className={`rounded-full px-5 py-3 text-sm font-bold transition ${
            active === city
              ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
              : "bg-white text-slate-600 hover:bg-sky-50"
          }`}
        >
          {city}
        </button>
      ))}
    </div>
  );
}