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
