# src/components/

Reusable components grouped by domain. None of these are route-level pages — they are consumed by pages and layouts.

## Subfolders

| Folder | Description |
|---|---|
| `auth/` | Authentication forms and route guard wrappers |
| `charts/` | Chart wrappers (bar, line) using ApexCharts |
| `common/` | Shared utility components (ScrollToTop, GridShape, ThemeToggleButton, etc.) |
| `ecommerce/` | E-commerce-specific widgets |
| `form/` | Controlled form primitives (Input, Label, Switch, GroupInput) |
| `header/` | Header-specific dropdowns (NotificationDropdown, UserDropdown) |
| `tables/` | Table components (BasicTableOne, etc.) |
| `ui/` | Generic design-system primitives (Alert, Avatar, Badge, Button, Dropdown, Modal, Images, Videos) |
| `UserProfile/` | Profile card sub-components (UserAddressCard, UserInfoCard, UserMetaCard) |

## Conventions

- Each sub-folder owns its own `index` or named exports.
- Components that need routing use `react-router` (not `react-router-dom`) for `Link` and `useNavigate`, keeping the import source consistent with the rest of the app (though both resolve the same in React Router v7).
