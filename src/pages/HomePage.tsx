import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditorPanel from "../components/EditorPanel";
import ScriptureList from "../components/ScriptureList";
import {
  deleteScripture,
  loadScriptures,
  saveScripture,
  saveScriptures,
} from "../services/scriptureService";
import type { Scripture } from "../types/scripture";

function HomePage() {
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const selectedScripture = useMemo(
    () => scriptures.find((item) => item.id === selectedId) ?? null,
    [scriptures, selectedId],
  );

  const categories = useMemo(() => {
    const names = scriptures.map((item) => item.category).filter(Boolean);
    return Array.from(new Set(names));
  }, [scriptures]);

  const visibleScriptures = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const byCategory =
      selectedCategory === "all"
        ? scriptures
        : scriptures.filter((item) => item.category === selectedCategory);

    if (!normalizedQuery) {
      return byCategory;
    }

    return byCategory.filter((item) => {
      const haystack = `${item.title} ${item.content} ${item.category}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [scriptures, selectedCategory, searchQuery]);

  useEffect(() => {
    const hydrate = async () => {
      const loaded = await loadScriptures();
      setScriptures(loaded.scriptures);
      setSelectedId((current) => current || loaded.scriptures[0]?.id || "");
      setStatusMessage(loaded.message ?? null);
      setIsLoading(false);
    };

    void hydrate();
  }, []);

  useEffect(() => {
    if (!visibleScriptures.length) {
      setSelectedId("");
      return;
    }

    if (!visibleScriptures.some((item) => item.id === selectedId)) {
      setSelectedId(visibleScriptures[0].id);
    }
  }, [selectedId, visibleScriptures]);

  const handleSelect = (scriptureId: string) => {
    setSelectedId(scriptureId);
    setIsEditing(false);
    if (isMobile) {
      setIsReaderOpen(true);
    }
  };

  const handleEdit = (scriptureId: string) => {
    setSelectedId(scriptureId);
    setIsEditing(true);
  };

  const handleSave = async (updated: Scripture) => {
    const next = scriptures.map((item) =>
      item.id === updated.id ? updated : item,
    );
    setScriptures(next);
    await saveScripture(updated);
    setIsEditing(false);
    setStatusMessage("Сохранено и отправлено в backend.");
  };

  const handleCreate = async () => {
    const newScripture: Scripture = {
      id: `scripture-${Date.now()}`,
      title: "Новый текст",
      content: "Начните писать новое писание здесь…",
      category: "Священные тексты",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const next = [newScripture, ...scriptures];
    setScriptures(next);
    setSelectedId(newScripture.id);
    setSelectedCategory("all");
    setIsEditing(true);
    await saveScriptures(next);
    setStatusMessage(
      "Создан новый текст. Начните редактировать его прямо сейчас.",
    );
  };

  const handleDelete = async () => {
    if (!selectedScripture) {
      return;
    }

    const next = scriptures.filter((item) => item.id !== selectedScripture.id);
    setScriptures(next);
    setSelectedId(next[0]?.id ?? "");
    setIsEditing(false);
    await deleteScripture(selectedScripture.id);
    setStatusMessage("Текст удалён из хранилища.");
  };

  if (isLoading) {
    return <div className="page-shell loading-state">Загрузка писаний…</div>;
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Религия святого жука</p>
          <h1>Хранилище писаний</h1>
          <p className="hero-text">
            Просматривайте священные тексты или переходите в режим правки.
          </p>
        </div>
        <div className="hero-actions">
          <img
            className="hero-symbol"
            src={`${import.meta.env.BASE_URL}juk.png`}
            alt="Символ святого жука"
          />
        </div>
      </header>

      {statusMessage ? (
        <div className="status-banner">{statusMessage}</div>
      ) : null}

      <main className="workspace">
        <ScriptureList
          scriptures={visibleScriptures}
          selectedId={selectedId}
          onSelect={handleSelect}
          onEdit={handleEdit}
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onCreate={handleCreate}
        />
        {isEditing ? (
          <EditorPanel
            scripture={selectedScripture}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ) : (
          <section className="panel view-panel">
            <div className="panel-header">
              <div>
                <h2>{selectedScripture?.title ?? "Выберите писание"}</h2>
                <p className="panel-subtitle">
                  {selectedScripture?.category ?? "Выберите текст из списка"}
                </p>
              </div>
              {selectedScripture ? (
                <span>
                  {(() => {
                    const value = selectedScripture.updatedAt;
                    const date = value instanceof Date ? value : new Date(String(value ?? ""));
                    return Number.isNaN(date.getTime())
                      ? "—"
                      : date.toLocaleDateString("ru-RU");
                  })()}
                </span>
              ) : null}
            </div>
            {selectedScripture ? (
              <div className="view-body">
                <div className="quote-mark">“</div>
                <p className="view-content">{selectedScripture.content}</p>
              </div>
            ) : (
              <p className="view-content empty-view">
                Выберите текст из списка, чтобы открыть его в режиме просмотра.
              </p>
            )}
          </section>
        )}
      </main>

      <Dialog open={isReaderOpen && Boolean(selectedScripture) && isMobile} onClose={() => setIsReaderOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{selectedScripture?.title ?? 'Писание'}</span>
          <IconButton onClick={() => setIsReaderOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="reader-illustration">
            <img src={`${import.meta.env.BASE_URL}juk.png`} alt="Святой жук" />
            <img src={`${import.meta.env.BASE_URL}juk_zloy.png`} alt="Ядовитый жук" />
          </div>
          <p className="view-content reader-content">{selectedScripture?.content ?? ''}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HomePage;
