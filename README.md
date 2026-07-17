# Святой жук
Сайт для просмотра и редактирования писаний религии святого жука.

## Стек технологий

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Backend**: Firebase Firestore

## Установка и запуск

### Требования
- Node.js 16+ 
- npm или yarn

### Инструкции

1. Установите зависимости:
```bash
npm install
```

2. Создайте `.env.local` файл на основе `.env.example` и добавьте ваши Firebase credentials:
```bash
cp .env.example .env.local
```

3. Запустите dev сервер:
```bash
npm run dev
```

Приложение откроется на http://localhost:3000

4. Для сборки продакшена:
```bash
npm run build
```

## Структура проекта

```
juk/
├── src/
│   ├── components/     # React компоненты
│   ├── pages/         # Страницы
│   ├── services/      # Firebase сервисы
│   ├── types/         # TypeScript типы
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Основной функционал

- [ ] Просмотр писаний по категориям
- [ ] Редактирование писаний (авторизованные пользователи)
- [ ] Система категоризации
- [ ] Firebase Firestore интеграция

## Следующие шаги

1. Настроить Firebase console и добавить credentials в `.env.local`
2. Создать компоненты для просмотра и редактирования
3. Настроить маршрутизацию
4. Добавить аутентификацию
