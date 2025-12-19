import React, { createContext, useContext, useState, ReactNode } from "react";

export type CalendarPayload = {
  label: string;
  checkIn: Date;
  checkOut: Date | null;
  mode: "range" | "single";
};

export type GuestsResult = {
  label: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
};

export type SearchPayload = {
  search: string;
  selectedCity?: {
    id: number;
    name: string;
    country?: string;
    image?: string;
  } | null;

  city?: {
    name: string;
    lat: number | null;
    long: number | null;
  } | null;
  calendar?: CalendarPayload | null;
  guests?: GuestsResult | null;
};

type SearchContextType = {
  searchState: SearchPayload;
  setSearchState: (
    p:
      | Partial<SearchPayload>
      | ((prev: SearchPayload) => Partial<SearchPayload>)
  ) => void;
  clearSearch: () => void;
};

const defaultState: SearchPayload = {
  search: "",
  selectedCity: null,
  calendar: null,
  guests: null,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchState, setRaw] = useState<SearchPayload>(defaultState);

  const setSearchState = (
    p:
      | Partial<SearchPayload>
      | ((prev: SearchPayload) => Partial<SearchPayload>)
  ) => {
    setRaw((prev) => ({ ...prev, ...(typeof p === "function" ? p(prev) : p) }));
  };

  const clearSearch = () => setRaw(defaultState);

  return (
    <SearchContext.Provider
      value={{ searchState, setSearchState, clearSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
