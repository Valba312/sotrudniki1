# Sotrudniki Full-stack SPA

Одностраничное приложение с общими типами, backend на Express/TypeScript + PostgreSQL и фронтендом на React/TypeScript (Vite).

## Пакеты
- `shared` — общие TypeScript типы (Users, Posts, Comments, EmployeeCard, DealMetrics, WalletSummary, AuthTokens).
- `backend` — REST API с JWT, PostgreSQL схемой и маршрутами для аутентификации, пользователей, постов, комментариев и кошелька сотрудника.
- `frontend` — React SPA с карточкой сотрудника, показателями сделок (приемщик/кладовщик) и кошельком баланса.

## Быстрый старт
1. Установите зависимости в режиме workspaces:
   ```bash
   npm install
   ```
   > Если `npm install` завершился ошибкой `403 Forbidden` (доступ к registry заблокирован), попробуйте:
   > - выставить явный реестр в `.npmrc`, например `registry=https://registry.npmjs.org/`;
   > - либо использовать офлайн-источник: положите заранее скачанные tarball-файлы зависимостей в локальный Verdaccio/registry и укажите его URL в `.npmrc`;
   > - убедитесь, что переменные окружения `HTTP_PROXY`/`HTTPS_PROXY` не указывают на недоступный прокси.
2. Запустите PostgreSQL и передайте строку подключения через `DATABASE_URL` (по умолчанию `postgres://postgres:postgres@localhost:5432/sotrudniki`).
3. Запустите API:
   ```bash
   npm run dev:backend
   ```
4. Запустите фронтенд:
   ```bash
   npm run dev:frontend
   ```
5. Откройте `http://localhost:5173`.

## Основные API-маршруты
- `POST /api/auth/register` — регистрация, возвращает токен.
- `POST /api/auth/login` — вход по email/паролю.
- `GET /api/users/me` — профиль текущего пользователя.
- `GET/POST /api/posts` — лента постов.
- `GET/POST /api/comments/post/:postId` — комментарии к посту.
- `GET /api/card` — карточка сотрудника.
- `GET /api/deals` — показатели приемщика/кладовщика.
- `GET /api/wallet` — сводка кошелька баланса.
