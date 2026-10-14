# Architecture

## Tech stack
| Layer | Choice | Why |
|---|---|---|
| UI | React 19 | Required by the brief |
| Build / dev server | Vite | Fast dev server, zero-config React |
| Routing | React Router | Menu navigation with real URLs |
| State | React `useReducer` + Context | Built-in; enough for one in-memory collection |
| Styling | Plain CSS with design tokens (CSS variables), light + dark mode | No CSS framework needed |
| Design system | Generated with the ui-ux-pro-max skill: dark slate palette + green accent, Fira Sans / Fira Code, dense dashboard spacing | Suits a data-heavy admin tool |
| Icons | Phosphor Icons (`@phosphor-icons/react`) | Consistent SVG icon set, no emoji |
| Tests | Vitest + React Testing Library + jsdom | Native to Vite, tests behaviour not internals |
| Lint | Oxlint | Comes with the Vite template |

## Structure
```
src/
  main.jsx           entry: BrowserRouter > AssetProvider > App
  App.jsx            header menu + routes
  AssetContext.jsx   seed data, reducer (add/update/remove), search, provider + useAssets hook
  pages/
    Home.jsx         dashboard stats
    AssetList.jsx    table, search, status filter, delete
    AssetForm.jsx    add + edit (same form; edit when :id is in the URL)
    About.jsx        team members
  index.css          theme tokens + layout
  App.test.jsx       reducer, search and UI tests
```

## Data flow
```
            dispatch({type, ...})
 Pages  ─────────────────────────▶  assetReducer  ──▶  new assets array
   ▲                                                       │
   └──────────────  useAssets() (Context)  ◀───────────────┘
```
- `assetReducer` is a pure function → easy to test, and in Part 2 its three actions map 1:1 to `POST`, `PUT`, `DELETE` endpoints.
- `searchAssets` is a pure function used by the list page.

## Routes
| Path | Page |
|---|---|
| `/` | Dashboard |
| `/assets` | Asset list + search |
| `/assets/new` | Add form |
| `/assets/:id/edit` | Edit form |
| `/about` | Team |

## Part 2 migration
Replace the reducer's in-memory array with fetch calls to the backend; pages keep using `useAssets()` unchanged.
