import { useEffect, useState } from "react";

export type Tone = "friendly" | "formal" | "persuasive";
export type Horizon = "daily" | "weekly";

export type Prefs = {
  tone: Tone;
  horizon: Horizon;
  signature: string;
  hoursPerDay: string;
};

const KEY = "aiwpa.prefs";

export const defaultPrefs: Prefs = {
  tone: "formal",
  horizon: "daily",
  signature: "",
  hoursPerDay: "6",
};

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...defaultPrefs, ...(JSON.parse(raw) as Partial<Prefs>) });
    } catch {
      /* ignore unreadable preferences */
    }
    setLoaded(true);
  }, []);

  const update = (patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore storage failures */
      }
      return next;
    });
  };

  return { prefs, update, loaded };
}
