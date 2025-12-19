import React, { createContext, useContext, useState, ReactNode } from "react";

/* ---------------- TYPES ---------------- */

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

export type GeoCity = {
  name: string;
  lat: number | null;
  long: number | null;
};

export type SelectedCity = {
  id: number;
  name: string;
  country?: string;
  image?: string;
};

export type SearchPayload = {
  search: string;
  selectedCity: SelectedCity | null;
  city: GeoCity | null;
  calendar: CalendarPayload | null;
  guests: GuestsResult | null;
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

/* ---------------- DEFAULT ---------------- */

const defaultState: SearchPayload = {
  search: "",
  selectedCity: null,
  city: null,
  calendar: null,
  guests: null,
};

/* ---------------- CONTEXT ---------------- */

const SearchContext = createContext<SearchContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchState, setRaw] = useState<SearchPayload>(defaultState);

  const setSearchState: SearchContextType["setSearchState"] = (payload) => {
    setRaw((prev) => {
      const partial = typeof payload === "function" ? payload(prev) : payload;

      return {
        ...prev,
        ...partial,
      };
    });
  };

  const clearSearch = () => setRaw(defaultState);

  return (
    <SearchContext.Provider
      value={{
        searchState,
        setSearchState,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return ctx;
}
