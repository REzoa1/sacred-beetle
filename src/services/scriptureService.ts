import type { Scripture } from "../types/scripture";

export const STORAGE_KEY = "juk-scriptures";

export type ScriptureLoadResult = {
  scriptures: Scripture[];
  source: "backend" | "local" | "mock";
  message?: string;
};

const normalizeDate = (value: unknown): Date => {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const normalizeScripture = (item: Record<string, unknown>): Scripture => ({
  id: String(item.id ?? ""),
  title: String(item.title ?? ""),
  content: String(item.content ?? ""),
  category: String(item.category ?? ""),
  createdAt: normalizeDate(item.createdAt),
  updatedAt: normalizeDate(item.updatedAt),
});

const BACKEND_URLS = [
  "http://localhost:3001/api/scriptures",
  "https://sacred-beetle-backend.onrender.com/api/scriptures",
];

export const getBackendCandidates = (): string[] => [...BACKEND_URLS];

const buildScriptureEndpoint = (backendUrl: string, scriptureId: string): string =>
  `${backendUrl}/${encodeURIComponent(scriptureId)}`;

const FALLBACK_DATA_URL = "/data/scriptures.json";

const loadLocalScriptures = async (): Promise<Scripture[]> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Record<string, unknown>[];
      const normalized = parsed.map((item) => normalizeScripture(item));
      if (normalized.length > 0) {
        return normalized;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const response = await fetch(FALLBACK_DATA_URL);
  const data = (await response.json()) as Record<string, unknown>[];
  const scriptures = data.map((item) => normalizeScripture(item));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(scriptures));
  return scriptures;
};

export const loadScriptures = async (): Promise<ScriptureLoadResult> => {
  for (const backendUrl of BACKEND_URLS) {
    try {
      const response = await fetch(backendUrl);
      if (response.ok) {
        const data = (await response.json()) as Record<string, unknown>[];
        const scriptures = data.map((item) => normalizeScripture(item));

        if (scriptures.length >= 3) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(scriptures));
          return {
            scriptures,
            source: "backend",
            message: "Загружены тексты из бэкенда.",
          };
        }
      }
    } catch {
      // try the next backend candidate
    }
  }

  try {
    const scriptures = await loadLocalScriptures();
    return {
      scriptures,
      source: scriptures.length > 0 ? "local" : "mock",
      message: "Показываю сохранённые локально тексты.",
    };
  } catch (error) {
    console.error("Failed to load scriptures from local data", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return {
      scriptures: [],
      source: "mock",
      message: "Не удалось загрузить данные.",
    };
  }
};

export const saveScripture = async (scripture: Scripture): Promise<void> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const current = saved ? (JSON.parse(saved) as Scripture[]) : [];
  const next = current.map((item) =>
    item.id === scripture.id ? scripture : item,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  for (const backendUrl of BACKEND_URLS) {
    try {
      await fetch(buildScriptureEndpoint(backendUrl, scripture.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scripture),
      });
      break;
    } catch {
      // keep local storage as fallback
    }
  }
};

export const deleteScripture = async (scriptureId: string): Promise<void> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const current = saved ? (JSON.parse(saved) as Scripture[]) : [];
  const next = current.filter((item) => item.id !== scriptureId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  for (const backendUrl of BACKEND_URLS) {
    try {
      await fetch(buildScriptureEndpoint(backendUrl, scriptureId), {
        method: "DELETE",
      });
      break;
    } catch {
      // keep local storage as fallback
    }
  }
};

export const saveScriptures = async (
  scriptures: Scripture[],
): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scriptures));

  for (const backendUrl of BACKEND_URLS) {
    try {
      await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scriptures),
      });
      break;
    } catch {
      // keep local storage as fallback
    }
  }
};
