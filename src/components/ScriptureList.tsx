import type { Scripture } from '../types/scripture'

interface ScriptureListProps {
  scriptures: Scripture[]
  selectedId: string
  selectedCategory: string
  categories: string[]
  onSelect: (id: string) => void
  onCategoryChange: (category: string) => void
  onCreate: () => void
}

function ScriptureList({
  scriptures,
  selectedId,
  selectedCategory,
  categories,
  onSelect,
  onCategoryChange,
  onCreate,
}: ScriptureListProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Писания</h2>
          <p className="panel-subtitle">Собрание священных строк и обрядовых наставлений.</p>
        </div>
        <span>{scriptures.length} текста</span>
      </div>

      <div className="toolbar-row">
        <label className="filter-field">
          <span>Категория</span>
          <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="all">Все</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="create-button" onClick={onCreate}>
          + Новый текст
        </button>
      </div>

      <div className="scripture-list">
        {scriptures.map((scripture) => (
          <button
            key={scripture.id}
            type="button"
            className={`scripture-card ${selectedId === scripture.id ? 'active' : ''}`}
            onClick={() => onSelect(scripture.id)}
          >
            <strong>{scripture.title}</strong>
            <span>{scripture.category}</span>
            <p>{scripture.content.slice(0, 80)}{scripture.content.length > 80 ? '…' : ''}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ScriptureList
