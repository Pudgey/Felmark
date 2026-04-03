import {
  EDITOR_MEMORY_NAMESPACE,
  type EditorMemoryStorageAdapter,
} from "./types";

export function getEditorMemoryStorageSlot(
  key: string,
  namespace = EDITOR_MEMORY_NAMESPACE,
): string {
  return `${namespace}_${key}`;
}

export function createLocalStorageAdapter(
  namespace = EDITOR_MEMORY_NAMESPACE,
): EditorMemoryStorageAdapter {
  return {
    load(key) {
      if (typeof window === "undefined") return null;

      try {
        const raw = window.localStorage.getItem(getEditorMemoryStorageSlot(key, namespace));
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    save(key, value) {
      if (typeof window === "undefined") return;

      try {
        window.localStorage.setItem(
          getEditorMemoryStorageSlot(key, namespace),
          JSON.stringify(value),
        );
      } catch {
        // Storage failures are non-fatal at this boundary.
      }
    },
  };
}
