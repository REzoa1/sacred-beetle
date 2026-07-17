import { useMemo, useState } from 'react'
import EditorPanel from '../components/EditorPanel'
import ScriptureList from '../components/ScriptureList'
import type { Scripture } from '../types/scripture'

const initialScriptures: Scripture[] = [
  {
    id: '1',
    title: 'Песнь о Скрытом Жуке',
    content:
      'В начале был тихий скрип, и он повёл за собой тех, кто слышал его в темноте. И каждый, кто отыскал его след, обрёл путь к созерцанию.',
    category: 'Священные тексты',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Клятва Панциря',
    content:
      'Пусть твой шаг будет ровен, а голос — как ржавый колокол в тумане. И тогда в тебе останется свет, не видимый, но верный.',
    category: 'Обряды',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]

function HomePage() {
  const [scriptures, setScriptures] = useState(initialScriptures)
  const [selectedId, setSelectedId] = useState(initialScriptures[0]?.id ?? '')

  const selectedScripture = useMemo(
    () => scriptures.find((item) => item.id === selectedId) ?? null,
    [scriptures, selectedId],
  )

  const handleSave = (updated: Scripture) => {
    setScriptures((current) => current.map((item) => (item.id === updated.id ? updated : item)))
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Религия святого жука</p>
          <h1>Хранилище писаний</h1>
          <p className="hero-text">Просматривайте тексты и правьте их в одном месте.</p>
        </div>
        <img className="hero-symbol" src="/beetle.jpg" alt="Символ святого жука" />
      </header>

      <main className="workspace">
        <ScriptureList scriptures={scriptures} selectedId={selectedId} onSelect={setSelectedId} />
        <EditorPanel scripture={selectedScripture} onSave={handleSave} />
      </main>
    </div>
  )
}

export default HomePage
