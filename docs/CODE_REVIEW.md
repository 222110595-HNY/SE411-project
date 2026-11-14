# AI Code Review

Reviewed: all files in `src/`. Tool: Claude (AI assistant).

## Security
| Finding | Status |
|---|---|
| No `dangerouslySetInnerHTML`; React escapes all rendered user input → no XSS. | ✅ OK |
| No secrets, tokens or API keys in the code. | ✅ OK |
| `npm audit`: 0 vulnerabilities. | ✅ OK |
| Validation is client-side only. Fine for Part 1, but the Part 2 backend **must** re-validate every field. | ⚠️ Part 2 |

## Performance
| Finding | Status |
|---|---|
| Search filters the whole array on each keystroke — O(n). Fine for hundreds of assets; add debouncing or server-side search if it grows to thousands. | ✅ OK for now |
| New id = `max(id) + 1` scans the array — O(n), negligible here. Backend will assign ids in Part 2. | ✅ OK |
| Production bundle: ~85 kB gzipped. | ✅ OK |

## Code quality
| Finding | Status |
|---|---|
| Reducer and search are pure functions, separated from UI and unit-tested. | ✅ Good |
| Lint: Oxlint warns that `AssetContext.jsx` exports both a component and functions, which disables Fast Refresh for that file. Only affects dev hot-reload. Fix: move `assetReducer`/`searchAssets`/constants into `assets.js`. | ⚠️ Minor |
| `confirm()` for delete is simple but not styled; replace with a modal if desired. | ℹ️ Optional |
| About page lists the team (2 members). | ✅ OK |

## Code reuse
| Finding | Status |
|---|---|
| One `AssetForm` component serves both add and edit. | ✅ Good |
| `TYPES` / `STATUSES` constants shared by form, list filter and dashboard. | ✅ Good |
| `field()` helper inside the form avoids repeating label/input markup. | ✅ Good |

## Tests
`npm test` → 15 tests passing (reducer: add/update/remove/immutability/set/unknown action; search: text, status, empty; UI: menu navigation, list, add, duplicate-tag rejection, edit, delete).

## UI / UX review (ui-ux-pro-max checklist)
| Check | Status |
|---|---|
| Text contrast ≥ 4.5:1 in light and dark mode; status badges show text + dot, not color only | ✅ |
| Visible focus rings, skip-to-content link, focus moves to the page on navigation | ✅ |
| Touch targets ≥ 44px (inputs, buttons, menu) | ✅ |
| SVG icons (Phosphor) instead of emoji; decorative icons `aria-hidden` | ✅ |
| Responsive: sidebar on desktop, tab bar on mobile; table becomes cards < 720px; no horizontal page scroll at 375px | ✅ |
| Form: grouped fieldsets, required markers, duplicate-tag error shown under the field with `aria-describedby` and focus moved to it | ✅ |
| Empty state with "Clear filters" action | ✅ |
| `prefers-reduced-motion` disables transitions | ✅ |
| Undo after delete (currently a confirm dialog only) | ℹ️ Optional |

---

## Part 2 — back-end review (`server/`)

### Security
| Finding | Status |
|---|---|
| Every request body is validated server-side (`@NotBlank`, `@NotNull`, `@PositiveOrZero`); invalid payloads return `400`. | ✅ OK |
| `POST`/`PUT` reject a client-supplied `id`, so clients cannot overwrite arbitrary rows. | ✅ OK |
| Spring Data JDBC uses parameterised statements → no SQL injection. | ✅ OK |
| No secrets in the repo; H2 is in-memory and local only. | ✅ OK |
| Dev uses a Vite proxy (same origin), so no permissive CORS is opened. | ✅ OK |

### Performance
| Finding | Status |
|---|---|
| `GET /api/v1/assets` is paginated (`PagingAndSortingRepository`), so large tables are not loaded at once. | ✅ OK |
| Lookups/updates/deletes are by primary key. | ✅ OK |
| H2 resets on restart; swap `schema.sql`/`data.sql` for a persistent DB if needed. | ℹ️ By design |

### Code quality
| Finding | Status |
|---|---|
| Clear Controller → Service → Repository layering (mirrors lab14). | ✅ Good |
| `Asset` is an immutable `record`; updates build a new record with the path id. | ✅ Good |
| `ObjectNotFoundException` maps to `404` in the controller. | ✅ Good |

### Tests
`./mvnw test` → 11 tests passing: service and controller tested with JUnit + Mockito (`@Mock`/`@InjectMocks`, one test per method), and a Spring context-load test.
