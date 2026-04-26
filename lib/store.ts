"use client";

import { useEffect, useState } from "react";
import { Item, Trip } from "../types/trip";

const STORAGE_KEY = "mundial-rucas-v5";

export const matchMap: Record<number, { city: string; stadium: string; address: string }> = {
  80: {
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    address: "Mercedes-Benz Stadium, Atlanta, GA",
  },
  96: {
    city: "Vancouver",
    stadium: "BC Place",
    address: "BC Place, Vancouver, BC",
  },
};

const initialTrips: Trip[] = [
  {
    city: "Dallas",
    airportAddress: "Dallas Fort Worth International Airport",
    airbnbAddress: "",
    stadiumAddress: "AT&T Stadium, Arlington, TX",
    barZone: "bars near AT&T Stadium, Arlington, TX",
    items: [
      {
        id: 1,
        type: "Partido",
        title: "Holanda vs Japón",
        city: "Dallas",
        cost: 8040,
        quantity: 2,
        paid: true,
        paidBy: "Ambos",
        stadium: "AT&T Stadium",
        stadiumAddress: "AT&T Stadium, Arlington, TX",
        resaleFeePct: 15,
      },
      {
        id: 2,
        type: "Vuelo",
        title: "Vuelo a Dallas",
        city: "Dallas",
        cost: 7311,
        quantity: 2,
        paid: true,
        paidBy: "Ambos",
      },
      {
        id: 3,
        type: "Airbnb",
        title: "Airbnb Dallas",
        city: "Dallas",
        cost: 8492,
        quantity: 1,
        paid: true,
        paidBy: "Ambos",
        airbnbAddress: "",
        airbnbLink: "",
      },
    ],
  },
  {
    city: "Vancouver",
    airportAddress: "Vancouver International Airport",
    airbnbAddress: "",
    stadiumAddress: "BC Place, Vancouver, BC",
    barZone: "bars near BC Place, Vancouver, BC",
    items: [
      {
        id: 4,
        type: "Partido",
        title: "Bélgica vs Nueva Zelanda",
        city: "Vancouver",
        cost: 3365,
        quantity: 2,
        paid: true,
        paidBy: "Ambos",
        stadium: "BC Place",
        stadiumAddress: "BC Place, Vancouver, BC",
        resaleFeePct: 15,
      },
      {
        id: 5,
        type: "Vuelo",
        title: "Vuelo a Vancouver",
        city: "Vancouver",
        cost: 7000,
        quantity: 2,
        paid: false,
        paidBy: "Ambos",
      },
      {
        id: 7,
        type: "Partido",
        title: "8vos - Partido 96",
        city: "Vancouver",
        cost: 15800,
        quantity: 2,
        paid: true,
        paidBy: "Ambos",
        matchNumber: 96,
        stadium: "BC Place",
        stadiumAddress: "BC Place, Vancouver, BC",
        resaleFeePct: 15,
      },
    ],
  },
  {
    city: "Atlanta",
    airportAddress: "Hartsfield-Jackson Atlanta International Airport",
    airbnbAddress: "",
    stadiumAddress: "Mercedes-Benz Stadium, Atlanta, GA",
    barZone: "bars near Mercedes-Benz Stadium, Atlanta, GA",
    items: [
      {
        id: 6,
        type: "Partido",
        title: "16vos - Partido 80",
        city: "Atlanta",
        cost: 9910,
        quantity: 2,
        paid: true,
        paidBy: "Ambos",
        matchNumber: 80,
        stadium: "Mercedes-Benz Stadium",
        stadiumAddress: "Mercedes-Benz Stadium, Atlanta, GA",
        resaleFeePct: 15,
      },
    ],
  },
];

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setTrips(JSON.parse(saved));
      return;
    }

    setTrips(initialTrips);
  }, []);

  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    }
  }, [trips]);

  function addCity(city: string) {
    if (!city.trim()) return;
    if (trips.find((trip) => trip.city === city)) return;

    setTrips([
      ...trips,
      {
        city,
        airportAddress: "",
        airbnbAddress: "",
        stadiumAddress: "",
        barZone: "",
        items: [],
      },
    ]);
  }

  function updateTrip(city: string, field: keyof Trip, value: string) {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.city === city ? { ...trip, [field]: value } : trip
      )
    );
  }

  function addItem(city: string, item: Item) {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.city === city
          ? { ...trip, items: [item, ...trip.items] }
          : trip
      )
    );
  }

  function updateItem(city: string, id: number, field: keyof Item, value: any) {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.city !== city) return trip;

        return {
          ...trip,
          items: trip.items.map((item) => {
            if (item.id !== id) return item;

            const next = { ...item, [field]: value };

            if (field === "matchNumber") {
              const match = matchMap[Number(value)];

              if (match) {
                next.city = match.city;
                next.stadium = match.stadium;
                next.stadiumAddress = match.address;
              }
            }

            return next;
          }),
        };
      })
    );
  }

  function deleteItem(city: string, id: number) {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.city === city
          ? { ...trip, items: trip.items.filter((item) => item.id !== id) }
          : trip
      )
    );
  }

  function resetTrips() {
    localStorage.removeItem(STORAGE_KEY);
    setTrips(initialTrips);
  }

  return {
    trips,
    addCity,
    updateTrip,
    addItem,
    updateItem,
    deleteItem,
    resetTrips,
  };
}