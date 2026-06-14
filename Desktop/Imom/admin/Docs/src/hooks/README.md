# src/hooks/

Custom React hooks that encapsulate reusable stateful logic.

## `useGoBack.ts`

Thin wrapper around React Router's `useNavigate` that returns a `goBack()` function.

```ts
const goBack = useGoBack();
// call goBack() to navigate -1 in history
```

Useful in breadcrumbs or "Back" buttons where you want browser-history back navigation.

---

## `useModal.ts`

Manages open/close state for a modal dialog.

### Returns

| Value | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Whether the modal is currently open |
| `openModal` | `() => void` | Set `isOpen = true` |
| `closeModal` | `() => void` | Set `isOpen = false` |

### Usage

```tsx
const { isOpen, openModal, closeModal } = useModal();

return (
  <>
    <Button onClick={openModal}>Open</Button>
    <Modal isOpen={isOpen} onClose={closeModal}>...</Modal>
  </>
);
```
