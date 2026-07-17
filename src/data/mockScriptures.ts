import type { Scripture } from '../types/scripture'

export const STORAGE_KEY = 'juk-scriptures'

export const mockScriptures: Scripture[] = [
  {
    id: '1',
    title: 'Песнь о Скрытом Жуке',
    content:
      'В начале был тихий скрип, и он повёл за собой тех, кто слышал его в темноте. И каждый, кто отыскал его след, обрёл путь к созерцанию.',
    category: 'Священные тексты',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Клятва Панциря',
    content:
      'Пусть твой шаг будет ровен, а голос — как ржавый колокол в тумане. И тогда в тебе останется свет, не видимый, но верный.',
    category: 'Обряды',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]
