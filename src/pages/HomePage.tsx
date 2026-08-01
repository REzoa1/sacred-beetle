import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
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
  const [isReaderOpen, setIsReaderOpen] = useState(false);

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

  useEffect(() => {
    if (!selectedScripture || isEditing || scriptures.length === 0) {
      return;
    }

    if (selectedId) {
      setIsReaderOpen(false);
    }
  }, [selectedScripture, isEditing, scriptures.length, selectedId]);

  const handleSelect = (scriptureId: string) => {
    setSelectedId(scriptureId);
    setIsEditing(false);
    setIsReaderOpen(true);
  };

  const handleEdit = (scriptureId: string) => {
    setSelectedId(scriptureId);
    setIsEditing(true);
    setIsReaderOpen(false);
  };

  const handleSave = async (updated: Scripture) => {
    const next = scriptures.map((item) =>
      item.id === updated.id ? updated : item,
    );
    setScriptures(next);
    await saveScripture(updated);
    setIsEditing(false);
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
    setIsReaderOpen(false);
    await saveScriptures(next);
  };

  const handleDelete = async () => {
    if (!selectedScripture) {
      return;
    }

    const next = scriptures.filter((item) => item.id !== selectedScripture.id);
    setScriptures(next);
    setSelectedId(next[0]?.id ?? "");
    setIsEditing(false);
    setIsReaderOpen(false);
    await deleteScripture(selectedScripture.id);
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

      <main className={`workspace ${isEditing ? "" : "single-column"}`}>
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
        ) : null}
      </main>

      <Dialog
        open={isReaderOpen && Boolean(selectedScripture)}
        onClose={() => setIsReaderOpen(false)}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(145deg, #f7ebc8 0%, #ead6a9 100%)', border: '1px solid rgba(139, 94, 45, 0.24)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)' } } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(139, 94, 45, 0.16)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>{selectedScripture?.title ?? 'Писание'}</span>
          <IconButton onClick={() => setIsReaderOpen(false)} size="small" sx={{ color: '#6a4522' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ background: 'rgba(255, 248, 228, 0.68)', paddingTop: 3, paddingBottom: 3 }}>
          <div className="reader-illustration">
            <img src={`${import.meta.env.BASE_URL}juk.png`} alt="Святой жук" />
            <img src={`${import.meta.env.BASE_URL}juk_zloy.png`} alt="Ядовитый жук" />
          </div>
          <div className="view-body reader-body">
            <div className="quote-mark">“</div>
            <p className="view-content reader-content">{selectedScripture?.content ?? ''}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HomePage;
