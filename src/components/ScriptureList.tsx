import type { Scripture } from '../types/scripture'

interface ScriptureListProps {
  scriptures: Scripture[]
  selectedId: string
  selectedCategory: string
  searchQuery: string
  categories: string[]
  onSelect: (id: string) => void
  onCategoryChange: (category: string) => void
  onSearchChange: (query: string) => void
  onCreate: () => void
}

function ScriptureList({
  scriptures,
  selectedId,
  selectedCategory,
  searchQuery,
  categories,
  onSelect,
  onCategoryChange,
  onSearchChange,
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
        <label className="filter-field search-field">
          <span>Поиск</span>
          <input
            type="search"
            value={searchQuery}
            placeholder="Название или текст"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <button type="button" className="create-button" onClick={onCreate}>
          + Новый текст
        </button>
      </div>

      <div className="scripture-list">
        {scriptures.length === 0 ? (
          <div className="empty-list">Ничего не найдено по этому запросу.</div>
        ) : (
          scriptures.map((scripture) => (
            <button
              key={scripture.id}
              type="button"
              className={`scripture-card ${selectedId === scripture.id ? 'active' : ''}`}
              onClick={() => onSelect(scripture.id)}
            >
              <strong>{scripture.title}</strong>
              <span>{scripture.category}</span>
              <p>{scripture.content.slice(0, 96)}{scripture.content.length > 96 ? '…' : ''}</p>
            </button>
          ))
        )}
      </div>
    </section>
  )
}

export default ScriptureList
