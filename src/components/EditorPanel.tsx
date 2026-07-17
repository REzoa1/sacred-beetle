import { useState } from 'react'
import type { Scripture } from '../types/scripture'

interface EditorPanelProps {
  scripture: Scripture | null
  onSave: (updated: Scripture) => void
}

function EditorPanel({ scripture, onSave }: EditorPanelProps) {
  const [title, setTitle] = useState(scripture?.title ?? '')
  const [category, setCategory] = useState(scripture?.category ?? '')
  const [content, setContent] = useState(scripture?.content ?? '')

  if (!scripture) {
    return (
      <section className="panel editor-panel empty-state">
        <h2>Выберите писание</h2>
        <p>Выберите текст из списка, чтобы открыть редактор.</p>
      </section>
    )
  }

  const handleSave = () => {
    onSave({
      ...scripture,
      title,
      category,
      content,
      updatedAt: new Date(),
    })
  }

  return (
    <section className="panel editor-panel">
      <div className="panel-header">
        <h2>Редактор</h2>
        <button type="button" className="save-button" onClick={handleSave}>
          Сохранить
        </button>
      </div>

      <label>
        Название
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>

      <label>
        Категория
        <input value={category} onChange={(event) => setCategory(event.target.value)} />
      </label>

      <label>
        Текст
        <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={12} />
      </label>
    </section>
  )
}

export default EditorPanel
