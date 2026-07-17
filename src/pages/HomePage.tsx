import { useEffect, useMemo, useState } from 'react'
import EditorPanel from '../components/EditorPanel'
import ScriptureList from '../components/ScriptureList'
import { loadScriptures, saveScripture } from '../services/scriptureService'
import type { Scripture } from '../types/scripture'

function HomePage() {
  const [scriptures, setScriptures] = useState<Scripture[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const selectedScripture = useMemo(
    () => scriptures.find((item) => item.id === selectedId) ?? null,
    [scriptures, selectedId],
  )

  useEffect(() => {
    const hydrate = async () => {
      const loaded = await loadScriptures()
      setScriptures(loaded.scriptures)
      setSelectedId((current) => current || loaded.scriptures[0]?.id || '')
      setStatusMessage(loaded.message ?? null)
      setIsLoading(false)
    }

    void hydrate()
  }, [])

  const handleSave = async (updated: Scripture) => {
    const next = scriptures.map((item) => (item.id === updated.id ? updated : item))
    setScriptures(next)
    await saveScripture(updated)
    setStatusMessage('Сохранено и отправлено в backend.')
  }

  if (isLoading) {
    return <div className="page-shell loading-state">Загрузка писаний…</div>
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

      {statusMessage ? <div className="status-banner">{statusMessage}</div> : null}

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
