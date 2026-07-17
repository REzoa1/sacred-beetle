export interface Scripture {
  id: string
  title: string
  content: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
}
