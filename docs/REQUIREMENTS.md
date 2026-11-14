# Requirements — IT Asset Manager (Part 1)

## Scope
Front-end only. Assets are **computers** owned by a company. Data is an in-memory array of objects; it resets on page reload. A backend is added in Part 2.

## Asset data model
| Field | Type | Rules |
|---|---|---|
| id | number | auto-generated, unique |
| tag | string | required, unique (case-insensitive), e.g. `PC-001` |
| type | enum | Laptop, Desktop, Server, Tablet |
| brand | string | required |
| model | string | required |
| serial | string | required |
| assignedTo | string | optional (empty = unassigned) |
| status | enum | Available, In Use, In Repair, Retired |
| purchaseDate | date | required |
| price | number (SAR) | required, ≥ 0 |

## Functional requirements
| ID | Requirement |
|---|---|
| FR-1 | The app has a menu to navigate between Dashboard, Assets, Add Asset and About. |
| FR-2 | The user can view all assets in a table. |
| FR-3 | The user can add an asset through a validated form. |
| FR-4 | The user can edit an existing asset. |
| FR-5 | The user can delete an asset after confirming. |
| FR-6 | The user can search assets by tag, type, brand, model, serial or assignee (case-insensitive). |
| FR-7 | The user can filter assets by status. |
| FR-8 | The dashboard shows the total count, count per status, and total value. |
| FR-9 | The About page shows each team member's name and student ID. |
| FR-10 | Duplicate asset tags are rejected with an error message. |

## Non-functional requirements
- Built with React; runs in modern browsers.
- Responsive layout (usable on phone width); supports light and dark mode.
- Form fields are labelled for accessibility.
- Automated tests cover data operations and the main user flows.

---

# Requirements — Part 2 (Java Spring back-end)

## Scope
A Java Spring Boot server (`server/`) exposes a REST API, stores assets in an H2 database, and is integrated with the Part 1 front-end. Built following the SE411 `lab14` solution patterns.

## Functional requirements
| ID | Requirement | Endpoint |
|---|---|---|
| BR-1 | The application is a Spring server. | Spring Boot 4, `server.port=3000` |
| BR-2 | The user can add an element. | `POST /api/v1/assets` → `201 Created` |
| BR-3 | The user can search for an element by id. | `GET /api/v1/assets/{id}` → `200` / `404` |
| BR-4 | The user can search for all elements with paginated results. | `GET /api/v1/assets?page=&size=` → paginated |
| BR-5 | The user can update an element. | `PUT /api/v1/assets/{id}` → `204` / `404` |
| BR-6 | A unit-test suite tests the backend (JUnit + Mockito). | `server/src/test/...` |
| BR-7 | The front-end and back-end are integrated and work together. | Vite proxy `/api` → `:3000` |

## Non-functional requirements
- Layered architecture: Controller → Service → Repository.
- Server-side validation of every field (Jakarta Bean Validation).
- `DELETE /api/v1/assets/{id}` is also supported for the front-end delete flow.
