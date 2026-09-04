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
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [savedScriptureIds, setSavedScriptureIds] = useState<string[]>([]);
  const [draftScripture, setDraftScripture] = useState<Scripture | null>(null);
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  const selectedScripture = useMemo(
    () => draftScripture ?? scriptures.find((item) => item.id === selectedId) ?? null,
    [draftScripture, scriptures, selectedId],
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
    const handleScroll = () => {
      setIsPageScrolled(window.scrollY > 220);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      const loaded = await loadScriptures();
      setScriptures(loaded.scriptures);
      setSavedScriptureIds(loaded.scriptures.map((item) => item.id));
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

  const handleSelect = (scriptureId: string) => {
    setDraftScripture(null);
    setSelectedId(scriptureId);
    setIsEditorOpen(false);
    setIsReaderOpen(true);
  };

  const handleEdit = (scriptureId: string) => {
    setDraftScripture(null);
    setSelectedId(scriptureId);
    setIsEditorOpen(true);
    setIsReaderOpen(false);
  };

  const handleSave = async (updated: Scripture) => {
    const isDraft = draftScripture?.id === updated.id;
    const next = isDraft
      ? [updated, ...scriptures]
      : scriptures.map((item) => (item.id === updated.id ? updated : item));
    setScriptures(next);

    if (!isDraft && savedScriptureIds.includes(updated.id)) {
      await saveScripture(updated);
    } else {
      await saveScriptures(next);
      setSavedScriptureIds((current) => [...current, updated.id]);
    }

    setDraftScripture(null);
    setIsEditorOpen(false);
  };

  const handleCreate = () => {
    const newScripture: Scripture = {
      id: `scripture-${Date.now()}`,
      title: "Новый текст",
      content: "Начните писать новое писание здесь…",
      category: "Священные тексты",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDraftScripture(newScripture);
    setSelectedId(newScripture.id);
    setSelectedCategory("all");
    setIsEditorOpen(true);
    setIsReaderOpen(false);
  };

  if (isLoading) {
    return <div className="page-shell loading-state">Загрузка писаний…</div>;
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <button className="menu-button" type="button" aria-label="Открыть меню">☰</button>
        <span className="hero-branch" aria-hidden="true" />
        <span className="hero-medallion" aria-hidden="true" />
        <img className="hero-beetle" src={`${import.meta.env.BASE_URL}juk.png`} alt="" />
        <div className="hero-copy">
          <p className="eyebrow">Религия святого жука</p>
          <h1>Хранилище писаний</h1>
          <p className="hero-text">
            Просматривайте священные тексты или вносите правки.
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

      <div className={`content-body ${isPageScrolled ? "is-scrolled" : ""}`}>
        <main className="workspace single-column">
          <ScriptureList
            scriptures={visibleScriptures}
            selectedId={selectedId}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={async (scriptureId) => {
              const target = scriptures.find((item) => item.id === scriptureId);
              if (!target) {
                return;
              }

              const next = scriptures.filter((item) => item.id !== scriptureId);
              setScriptures(next);
              setSelectedId(next[0]?.id ?? "");
              setIsEditorOpen(false);
              setIsReaderOpen(false);
              await deleteScripture(scriptureId);
            }}
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onCreate={handleCreate}
          />
        </main>

        <footer className="blessing">
          <div className="blessing-medallion">
            <img src={`${import.meta.env.BASE_URL}juk.png`} alt="" />
          </div>
          <div className="blessing-copy">
            <p>Да благословит Святой Жук<br />всех искателей истины.</p>
            <span className="blessing-ornament" aria-hidden="true" />
          </div>
          <div className="blessing-stars" aria-hidden="true" />
        </footer>
      </div>

      <Dialog
        className="editor-dialog"
        open={isEditorOpen && Boolean(selectedScripture)}
        onClose={() => {
          setDraftScripture(null);
          setIsEditorOpen(false);
        }}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { className: 'editor-dialog-paper' } }}
      >
        <DialogTitle className="editor-dialog-title">
          <span>{draftScripture ? "Создание писания" : "Редактирование писания"}</span>
          <IconButton
            onClick={() => {
              setDraftScripture(null);
              setIsEditorOpen(false);
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="editor-dialog-content" dividers>
          <EditorPanel
            scripture={selectedScripture}
            onSave={handleSave}
          />
        </DialogContent>
        <div className="editor-dialog-footer">
          <button type="submit" className="editor-action primary" form="scripture-editor-form">
            Сохранить
          </button>
        </div>
      </Dialog>

      <Dialog
        className="reader-dialog"
        open={isReaderOpen && Boolean(selectedScripture)}
        onClose={() => setIsReaderOpen(false)}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { className: 'reader-dialog-paper' } }}
      >
        <DialogTitle className="reader-dialog-title">
          <span>{selectedScripture?.title ?? 'Писание'}</span>
          <IconButton onClick={() => setIsReaderOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="reader-dialog-content" dividers>
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
