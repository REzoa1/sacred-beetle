import type { Scripture } from "../types/scripture";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

interface ScriptureListProps {
  scriptures: Scripture[];
  selectedId: string;
  selectedCategory: string;
  searchQuery: string;
  categories: string[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onCreate: () => void;
}

const getCategoryIconClass = (category: string): string => {
  const icons: Record<string, string> = {
    "Священные тексты": "category-icon-leaf",
    Обряды: "category-icon-beetle",
    Пророчества: "category-icon-sun",
    Молитвы: "category-icon-moon",
    Учения: "category-icon-leaf",
  };

  return icons[category] ?? "category-icon-beetle";
};

function ScriptureList({
  scriptures,
  selectedId,
  selectedCategory,
  searchQuery,
  categories,
  onSelect,
  onEdit,
  onDelete,
  onCategoryChange,
  onSearchChange,
  onCreate,
}: ScriptureListProps) {
  return (
    <section className="panel">
      <div className="list-toolbar">
        <label className="filter-field search-field">
          <span className="sr-only">Поиск по писаниям</span>
          <input
            type="search"
            value={searchQuery}
            placeholder="Название или текст"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      <div className="category-row">
        <label className="filter-field category-field">
          <span>Категория</span>
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">Все</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="create-button compact-create-button"
          aria-label="Создать новый текст"
          onClick={onCreate}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="scripture-list">
        {scriptures.length === 0 ? (
          <div className="empty-list">Ничего не найдено по этому запросу.</div>
        ) : (
          scriptures.map((scripture) => (
            <div
              key={scripture.id}
              className={`scripture-card ${selectedId === scripture.id ? "active" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={`Открыть: ${scripture.title}`}
              onClick={() => onSelect(scripture.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(scripture.id);
                }
              }}
            >
              <span
                className={`scripture-icon ${getCategoryIconClass(scripture.category)}`}
                aria-hidden="true"
              />
              <div className="scripture-card-main">
                <strong>{scripture.title}</strong>
                <span>{scripture.category}</span>
                <p>
                  {scripture.content.slice(0, 96)}
                  {scripture.content.length > 96 ? "…" : ""}
                </p>
              </div>
              <div className="scripture-card-actions">
                <button
                  type="button"
                  className="scripture-card-edit"
                  aria-label={`Редактировать: ${scripture.title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(scripture.id);
                  }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </button>
                <button
                  type="button"
                  className="scripture-card-delete"
                  aria-label={`Удалить: ${scripture.title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(scripture.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
              <span className="scripture-arrow" aria-hidden="true" />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ScriptureList;
