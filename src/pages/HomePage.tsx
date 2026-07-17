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
  const [isEditing, setIsEditing] = useState(true)

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
        <div className="hero-copy">
          <p className="eyebrow">Религия святого жука</p>
          <h1>Хранилище писаний</h1>
          <p className="hero-text">Просматривайте священные тексты или переходите в режим правки.</p>
        </div>
        <div className="hero-actions">
          <button type="button" className={`mode-toggle ${isEditing ? 'active' : ''}`} onClick={() => setIsEditing(true)}>
            Редактировать
          </button>
          <button type="button" className={`mode-toggle ${!isEditing ? 'active' : ''}`} onClick={() => setIsEditing(false)}>
            Просмотр
          </button>
          <img className="hero-symbol" src="/juk.png" alt="Символ святого жука" />
        </div>
      </header>

      <main className="workspace">
        <ScriptureList scriptures={scriptures} selectedId={selectedId} onSelect={setSelectedId} />
        {isEditing ? (
          <EditorPanel scripture={selectedScripture} onSave={handleSave} />
        ) : (
          <section className="panel view-panel">
            <div className="panel-header">
              <h2>{selectedScripture?.title ?? 'Выберите писание'}</h2>
              <span>{selectedScripture?.category ?? ''}</span>
            </div>
            <p className="view-content">{selectedScripture?.content ?? 'Выберите текст из списка, чтобы открыть его в режиме просмотра.'}</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default HomePage
