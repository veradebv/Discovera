# Readly

Readly is a social reading web app where readers can explore books, save notes, and share reviews. The current MVP focuses on a clean, editorial UI plus an authentication flow that connects to a backend API.

## Highlights
- Modern Angular standalone components
- Book list and detail views
- Auth flow with register/login screens
- Toast notifications for auth feedback
- Polished layout, typography, and responsive styling

## Tech stack
- Angular (standalone)
- TypeScript
- RxJS

## Project structure
```
src/
	app/
		auth/          # Login + register features
		books/         # Book list and detail views
		layout/        # App shell (header/footer)
		pages/         # Static pages (about/privacy/terms)
		shared/        # Shared utilities (toast, pipes, directives)
```

## Getting started
1. Install dependencies
2. Start the dev server
3. Open the app in your browser

```
npm install
npm start
```

## Backend integration (register)
The register flow calls the backend endpoint:

```
POST http://localhost:3000/auth/register
```

Expected payload:
```
{
	"email": "user@example.com",
	"username": "veradeb",
	"password": "secret123"
}
```

Expected response:
```
{
	"accessToken": "...",
	"user": {
		"id": "...",
		"email": "...",
		"username": "..."
	}
}
```

Update the API base URL in `src/app/auth/auth.service.ts` if your backend runs elsewhere.

## Error handling
- Network failures display a toast notification
- Validation and duplicate-user errors display backend messages when available

## Scripts
- `npm start` — run the dev server
- `npm test` — run unit tests

## Status
🚧 In development — MVP in progress