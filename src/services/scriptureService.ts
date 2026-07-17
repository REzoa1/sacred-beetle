import type { Scripture } from '../types/scripture'

export const STORAGE_KEY = 'juk-scriptures'

export type ScriptureLoadResult = {
  scriptures: Scripture[]
  source: 'backend' | 'local' | 'mock'
  message?: string
}

const normalizeScripture = (item: Record<string, unknown>): Scripture => ({
  id: String(item.id ?? ''),
  title: String(item.title ?? ''),
  content: String(item.content ?? ''),
  category: String(item.category ?? ''),
  createdAt: item.createdAt ? new Date(String(item.createdAt)) : new Date(),
  updatedAt: item.updatedAt ? new Date(String(item.updatedAt)) : new Date(),
})

const BACKEND_URL = 'http://localhost:3001/api/scriptures'

export const loadScriptures = async (): Promise<ScriptureLoadResult> => {
  try {
    const response = await fetch(BACKEND_URL)
    if (response.ok) {
      const data = (await response.json()) as Record<string, unknown>[]
      const scriptures = data.map((item) => normalizeScripture(item))

      localStorage.setItem(STORAGE_KEY, JSON.stringify(scriptures))
      return {
        scriptures,
        source: 'backend',
        message: 'Загружены тексты из бэкенда.',
      }
    }
  } catch {
    // fallback below
  }

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Scripture[]
      return {
        scriptures: parsed,
        source: 'local',
        message: 'Показываю сохранённые локально тексты.',
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  try {
    const response = await fetch('/data/scriptures.json')
    const data = (await response.json()) as Record<string, unknown>[]
    const scriptures = data.map((item) => normalizeScripture(item))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scriptures))
    return {
      scriptures,
      source: 'mock',
      message: 'Загружены тексты из каталога сайта.',
    }
  } catch (error) {
    console.error('Failed to load scriptures from public data', error)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    return {
      scriptures: [],
      source: 'mock',
      message: 'Не удалось загрузить данные.',
    }
  }
}

export const saveScripture = async (scripture: Scripture): Promise<void> => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const current = saved ? (JSON.parse(saved) as Scripture[]) : []
  const next = current.map((item) => (item.id === scripture.id ? scripture : item))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  try {
    await fetch(`${BACKEND_URL}/${encodeURIComponent(scripture.id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scripture),
    })
  } catch {
    // keep local storage as fallback
  }
}

export const saveScriptures = async (scriptures: Scripture[]): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scriptures))

  try {
    await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scriptures),
    })
  } catch {
    // keep local storage as fallback
  }
}
