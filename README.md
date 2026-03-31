# ReadIt

Expo React Native take-home project for a Hacker News reader with mock auth, offline caching, bookmarks, theming, and article detail view.

## Setup

Install and run:

```bash
npm install
npx expo start
```

Useful commands:

```bash
npm test
npx tsc --noEmit
```

Mock login credentials:

```txt
user@readit.dev
password123
```

## Architecture

- Expo Router for app structure and navigation
- React Query for network fetching and in-memory request caching
- Zustand for local app state
  - `authStore` for session state
  - `bookmarksStore` for saved articles
  - `selectedArticleStore` for handoff to detail screen
- AsyncStorage for cached feed and bookmarks
- SecureStore for auth token persistence
- NetInfo for online/offline detection

Navigation note:
- navigation lives in Expo Router layout files under `src/app` rather than a separate `navigation/` folder

Why Zustand:
- small API surface
- good fit for isolated stores instead of one large global store

## Trade-offs

- Mock auth is fully client-side because the task allows it
- Feed cache is intentionally simple: last successful feed snapshot
- One focused unit test was added for the bookmarks store instead of broad test coverage
- The Hacker News `user/{id}` endpoint was not used because the current UI only needs the author username, which already comes from each item’s `by` field

## With More Time

- move mock auth to a small backend service and replace the mock token with a real JWT flow
- add more test coverage for hooks and auth flow
