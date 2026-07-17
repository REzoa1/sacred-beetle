import type { Scripture } from '../types/scripture'

interface ScriptureListProps {
  scriptures: Scripture[]
  selectedId: string
  onSelect: (id: string) => void
}

function ScriptureList({ scriptures, selectedId, onSelect }: ScriptureListProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Писания</h2>
        <span>{scriptures.length} текста</span>
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
