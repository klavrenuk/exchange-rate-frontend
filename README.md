# Exchange Rate Frontend

Vue 3 + TypeScript + Vite. Структура: FSD.

## Требования

- Node.js 18+
- Запущенный бэкенд: `http://127.0.0.1:8000`

## Запуск

```bash
npm install
```

Скопируйте настройки:

```bash
Copy-Item .env.example .env
```

`.env`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Если `.env` нет, используется `http://127.0.0.1:8000`.

```bash
npm run dev
```

Приложение: http://localhost:5173

## Проверка

```bash
npm run test
npm run build
```

## Структура

- `src/app` — точка входа, стили
- `src/pages` — страницы
- `src/widgets` — блоки интерфейса
- `src/features` — действия пользователя
- `src/entities` — работа с сущностями
- `src/shared` — API-клиент, конфиг, общие утилиты

## Что показывает интерфейс

- счётчики валют, курсов и графиков;
- последние задачи и их ошибки;
- курсы за дату;
- кнопки ручного запуска сбора и отправки;
- список графиков IEA со статусом отправки.
