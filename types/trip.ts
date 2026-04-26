export type ItemType =
  | "Partido"
  | "Vuelo"
  | "Airbnb"
  | "Vale"
  | "Transporte"
  | "Comida"
  | "Actividad"
  | "Bar"
  | "Otro";

export type Person = "Roy" | "Acompañante" | "Ambos";

export type Item = {
  id: number;
  type: ItemType;
  title: string;
  city: string;
  cost: number;
  quantity: number;
  paid: boolean;
  paidBy: Person;
  matchNumber?: number;
  stadium?: string;
  stadiumAddress?: string;
  airbnbAddress?: string;
  airbnbLink?: string;
  airportAddress?: string;
  flightDate?: string;
  eventDate?: string;
  resalePrice?: number;
  resaleQuantity?: number;
  resaleFeePct?: number;
  notes?: string;
};

export type Trip = {
  city: string;
  airportAddress: string;
  airbnbAddress: string;
  stadiumAddress: string;
  barZone: string;
  items: Item[];
};