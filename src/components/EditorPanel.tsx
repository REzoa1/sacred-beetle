import { useEffect, useState } from 'react'
import type { Scripture } from '../types/scripture'

interface EditorPanelProps {
  scripture: Scripture | null
  onSave: (updated: Scripture) => void
}

function EditorPanel({ scripture, onSave }: EditorPanelProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Священные тексты')
  const [content, setContent] = useState('')

  useEffect(() => {
    setTitle(scripture?.title ?? '')
    setCategory(scripture?.category ?? 'Священные тексты')
    setContent(scripture?.content ?? '')
  }, [scripture])

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
      title: title.trim() || 'Без названия',
      category: category.trim() || 'Священные тексты',
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
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="Священные тексты">Священные тексты</option>
          <option value="Обряды">Обряды</option>
          <option value="Пророчества">Пророчества</option>
          <option value="Литании">Литании</option>
        </select>
      </label>

      <label>
        Текст
        <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={12} />
      </label>
    </section>
  )
}

export default EditorPanel
