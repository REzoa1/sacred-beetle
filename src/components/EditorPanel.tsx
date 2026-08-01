import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import type { Scripture } from '../types/scripture'

interface EditorPanelProps {
  scripture: Scripture | null
  onSave: (updated: Scripture) => void
  onDelete: () => void
}

function EditorPanel({ scripture, onSave, onDelete }: EditorPanelProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Священные тексты')
  const [content, setContent] = useState('')

  useEffect(() => {
    setTitle(scripture?.title ?? '')
    setCategory(scripture?.category ?? 'Священные тексты')
    setContent(scripture?.content ?? '')
  }, [scripture])

  const helperText = useMemo(() => {
    if (!scripture) {
      return 'Выберите текст из списка, чтобы открыть редактор.'
    }

    return `Редактируете: ${scripture.title}`
  }, [scripture])

  if (!scripture) {
    return (
      <section className="panel editor-panel empty-state">
        <Typography variant="h6">Выберите писание</Typography>
        <Typography color="text.secondary">{helperText}</Typography>
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
        <div>
          <h2>Редактор</h2>
          <p className="panel-subtitle">{helperText}</p>
        </div>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="inherit" startIcon={<DeleteOutlineOutlinedIcon />} onClick={onDelete}>
            Удалить
          </Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave}>
            Сохранить
          </Button>
        </Stack>
      </div>

      <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
