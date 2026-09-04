import { useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
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
        <Typography variant="h6">Выберите писание</Typography>
        <Typography color="text.secondary">Выберите текст из списка, чтобы открыть редактор.</Typography>
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
    <section className="editor-shell">
      <Box
        component="form"
        id="scripture-editor-form"
        noValidate
        className="editor-form"
        onSubmit={(event) => {
          event.preventDefault()
          handleSave()
        }}
      >
        <TextField
          label="Название"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fullWidth
          variant="outlined"
        />

        <FormControl fullWidth>
          <InputLabel id="category-select-label">Категория</InputLabel>
          <Select
            labelId="category-select-label"
            label="Категория"
            value={category}
            onChange={(event) => setCategory(String(event.target.value))}
          >
            <MenuItem value="Священные тексты">Священные тексты</MenuItem>
            <MenuItem value="Обряды">Обряды</MenuItem>
            <MenuItem value="Пророчества">Пророчества</MenuItem>
            <MenuItem value="Литании">Литании</MenuItem>
            <MenuItem value="Молитвы">Молитвы</MenuItem>
            <MenuItem value="Учения">Учения</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Текст"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          multiline
          minRows={12}
          fullWidth
          variant="outlined"
        />
      </Box>
    </section>
  )
}

export default EditorPanel
