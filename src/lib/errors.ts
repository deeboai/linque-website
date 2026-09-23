/**
 * Extracts a human-readable message from a thrown value.
 *
 * Supabase does not throw `Error` instances. A failed query rejects with a
 * PostgrestError — a plain object carrying `message`, `code`, `details` and
 * `hint` — so the common `error instanceof Error ? error.message : fallback`
 * check silently discards the only useful part and shows the fallback instead.
 * That turns an actionable database error into "Unable to save job".
 */

type MessageLike = {
  message?: unknown;
  hint?: unknown;
};

const readString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message || fallback;

  const message = readString(error);
  if (message) return message;

  if (typeof error === "object" && error !== null) {
    const candidate = error as MessageLike;
    const primary = readString(candidate.message);
    if (primary) {
      // Postgres hints say what to do about the error, so keep them when present.
      const hint = readString(candidate.hint);
      return hint ? `${primary} (${hint})` : primary;
    }
  }

  return fallback;
};
