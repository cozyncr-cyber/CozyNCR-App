import { useCallback, useEffect, useState } from "react";
import { useSearch } from "@/src/contexts/SearchContext";

export type GuestsResult = {
  label: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
};

export type SelectedCity = {
  name: string;
  lat: number | null;
  long: number | null;
};

export type DraftSearchState = {
  search: string;
  city: SelectedCity | null;
  calendar: any | null;
  guests: GuestsResult | null;
};

/* ---------------- DEBOUNCE ---------------- */

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/* ---------------- HOOK ---------------- */

export function useSearchDraft(visible: boolean) {
  const { searchState, setSearchState } = useSearch();

  const [draft, setDraft] = useState<DraftSearchState>({
    search: "",
    city: null,
    calendar: null,
    guests: null,
  });

  // local search input (debounced)
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  /* ---------- sync FROM global state on open ---------- */
  useEffect(() => {
    if (!visible) return;

    setDraft({
      search: searchState.search ?? "",
      city: searchState.city ?? null,
      calendar: searchState.calendar ?? null,
      guests: searchState.guests ?? null,
    });

    setSearchInput(searchState.search ?? "");
  }, [visible]);

  /* ---------- debounced search update ---------- */
  useEffect(() => {
    setDraft((d) => ({ ...d, search: debouncedSearch }));
  }, [debouncedSearch]);

  /* ---------- helpers ---------- */

  const setCity = useCallback((city: SelectedCity | null) => {
    setDraft((d) => ({ ...d, city }));
  }, []);

  const setCalendar = useCallback((calendar: any | null) => {
    setDraft((d) => ({ ...d, calendar }));
  }, []);

  const setGuests = useCallback((guests: GuestsResult | null) => {
    setDraft((d) => ({ ...d, guests }));
  }, []);

  const clearAll = useCallback(() => {
    setDraft({
      search: "",
      city: null,
      calendar: null,
      guests: null,
    });
    setSearchInput("");
  }, []);
  const commit = useCallback(
    (override?: Partial<DraftSearchState>) => {
      setSearchState((prev) => ({
        ...prev,
        ...draft,
        ...override,
      }));
    },
    [draft]
  );

  return {
    draft,
    searchInput,
    setSearchInput,

    setCity,
    setCalendar,
    setGuests,

    clearAll,
    commit,
  };
}
