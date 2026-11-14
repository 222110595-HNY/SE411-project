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

---

# Part 2 — Spring backend

The backend lives in `server/` and follows the same layering as the SE411 `lab14` solution (Controller → Service → Repository, a `record` model with `@Id` and Bean Validation, an `ObjectNotFoundException`, and `ResponseEntity` return types).

## Backend tech stack
| Layer | Choice | Why |
|---|---|---|
| Language | Java 21 | lab14 baseline |
| Framework | Spring Boot 4.1.2 (Spring Web MVC) | REST controllers |
| Persistence | Spring Data JDBC | `CrudRepository` + `PagingAndSortingRepository` |
| Database | H2 (in-memory) via `schema.sql` + `data.sql` | Resets each run, zero setup |
| Validation | Jakarta Bean Validation | `@NotBlank`, `@NotNull`, `@PositiveOrZero` on the model |
| Build | Maven (wrapper `mvnw` included) | Same as lab14 |
| Tests | JUnit 5 + Mockito, `@WebMvcTest` + MockMvc | Unit-test every layer |

## Backend structure
```
server/
  pom.xml
  src/main/java/edu/psu/se411/assetmanager/
    AssetManagerServerApplication.java   Spring Boot entry point
    controller/AssetController.java      REST endpoints, @RequestMapping("/api/v1/assets")
    service/AssetService.java            business logic, throws ObjectNotFoundException
    repository/AssetRepository.java      Spring Data JDBC repository (CRUD + paging)
    model/Asset.java                     record with @Id and validation annotations
    exception/ObjectNotFoundException.java
  src/main/resources/
    application.properties               server.port=3000
    schema.sql                           asset table
    data.sql                             5 seed rows (match the front-end seed)
  src/test/java/edu/psu/se411/assetmanager/
    AssetManagerServerApplicationTests.java   context loads
    service/AssetServiceTest.java             Mockito unit tests (mocked repository)
    controller/AssetControllerTest.java       @WebMvcTest + MockMvc (mocked service)
```

## Backend data model (`asset` table)
| Field | Java type | Column | Rules |
|---|---|---|---|
| id | Long | id (identity) | auto-generated |
| tag | String | tag | `@NotBlank` |
| type | String | type | `@NotBlank` |
| brand | String | brand | `@NotBlank` |
| model | String | model | `@NotBlank` |
| serial | String | serial | `@NotBlank` |
| assignedTo | String | assigned_to | optional |
| status | String | status | `@NotBlank` |
| purchaseDate | LocalDate | purchase_date | `@NotNull` |
| price | Double | price | `@NotNull`, `@PositiveOrZero` |

## REST API routes
(The route table the presentation asks for, in the lab14 style.)

| Method | Path | Request body | Success | Errors | Description |
|---|---|---|---|---|---|
| GET | `/api/v1/assets?page=&size=&sort=` | — | `200 OK` — paginated list (`content` + `page`) | — | List assets with pagination |
| GET | `/api/v1/assets/{id}` | — | `200 OK` — the asset | `404` not found | Search an asset by id |
| POST | `/api/v1/assets` | Asset JSON (no `id`) | `201 Created` + `Location` header | `400` invalid body or `id` present | Add an asset |
| PUT | `/api/v1/assets/{id}` | Asset JSON (no `id`) | `204 No Content` | `400`, `404` not found | Update an asset |
| DELETE | `/api/v1/assets/{id}` | — | `204 No Content` | `404` not found | Delete an asset |

## How the two parts connect
```
Browser                 Vite dev server (:5173)              Spring Boot (:3000)
  React app  ──fetch /api/v1/assets──▶  proxy /api  ──────▶  AssetController
             ◀──────── JSON ──────────            ◀────────  AssetService ─▶ AssetRepository ─▶ H2
```
- `src/api.js` wraps `fetch` for list/get/create/update/delete.
- `AssetProvider` loads assets from the API on mount and re-fetches after every create/update/delete.
- `vite.config.js` proxies `/api` to `http://localhost:3000`, so the browser calls one origin (no CORS needed in dev); set `VITE_API_URL` to point elsewhere.
- The pure `assetReducer` / `searchAssets` functions stay in the front-end for client-side search, filtering and unit tests.
