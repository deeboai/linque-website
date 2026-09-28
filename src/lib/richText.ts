import DOMPurify from "dompurify";

/**
 * Rich text handling for admin-authored content.
 *
 * Job postings store two representations of each body field:
 *   - a `*_html` column holding sanitized markup (the source of truth when present)
 *   - the original plain-text column, kept in sync as a plain-text projection
 *
 * The plain-text projection is what feeds SEO meta descriptions, JSON-LD, and the
 * jobs listing blurb, so those surfaces never need to know rich text exists.
 * Postings authored before this feature have no `*_html` value, which is the
 * unambiguous signal to fall back to the legacy plain-text column.
 */

// Deliberately narrow. Headings, images, tables and scripts are all excluded:
// admins asked for Word-style emphasis, not arbitrary page structure.
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "mark",
];

// No `class`: nothing the toolbar produces uses it, and allowing it would let pasted
// markup (Word's "MsoNormal", other sites' utility classes) latch onto site styles.
const ALLOWED_ATTR = ["href", "target", "rel", "style", "data-color"];

// The only CSS the toolbar can produce. Everything else in a `style` attribute is
// either Word residue or something we did not author, so it is dropped.
const ALLOWED_STYLE_PROPS = new Set(["color", "background-color"]);

// #abc / #aabbcc / rgb(…) / rgba(…) / a bare colour keyword. Notably excludes
// url(), which would otherwise let pasted markup issue requests to a third party
// every time the posting is viewed.
const SAFE_COLOR_VALUE = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\)|[a-z]+)$/i;

const sanitizeStyleAttribute = (style: string): string =>
  style
    .split(";")
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      if (separator === -1) return null;
      const prop = declaration.slice(0, separator).trim().toLowerCase();
      const value = declaration.slice(separator + 1).trim();
      if (!ALLOWED_STYLE_PROPS.has(prop) || !SAFE_COLOR_VALUE.test(value)) return null;
      return `${prop}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");

let hookInstalled = false;

const installHooks = () => {
  if (hookInstalled || typeof window === "undefined") return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    // Any surviving anchor opens in a new tab without handing the opener window
    // to the destination.
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
    // DOMPurify leaves `style` contents alone; narrow it to colour declarations.
    if (node.hasAttribute?.("style")) {
      const safeStyle = sanitizeStyleAttribute(node.getAttribute("style") ?? "");
      if (safeStyle) {
        node.setAttribute("style", safeStyle);
      } else {
        node.removeAttribute("style");
      }
    }
  });
  hookInstalled = true;
};

/** ProseMirror leaves a trailing empty paragraph behind; it renders as a stray gap. */
const trimTrailingEmptyParagraphs = (html: string) =>
  html.replace(/(?:<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>)+$/i, "");

/** Sanitize untrusted-shaped HTML down to the allowlist above. */
export const sanitizeRichText = (html: string | null | undefined): string => {
  if (!html) return "";
  installHooks();
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Block javascript:, data: and other non-navigational URI schemes on links.
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
  return trimTrailingEmptyParagraphs(clean);
};

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Convert a legacy plain-text field into equivalent markup, preserving blank-line breaks. */
export const plainTextToHtml = (text: string | null | undefined): string => {
  if (!text?.trim()) return "";
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
    .join("");
};

/** Convert a legacy string array into an equivalent bulleted list. */
export const plainListToHtml = (items: string[] | null | undefined): string => {
  const cleaned = (items ?? []).map((item) => item.trim()).filter(Boolean);
  if (!cleaned.length) return "";
  return `<ul>${cleaned.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
};

const parseToDocument = (html: string): Document | null => {
  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") return null;
  return new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
};

/**
 * Flatten markup to readable plain text. Used for meta descriptions, JSON-LD, and
 * the listing blurb — surfaces where raw tags would leak into search results.
 */
export const richTextToPlainText = (html: string | null | undefined): string => {
  if (!html) return "";
  const doc = parseToDocument(sanitizeRichText(html));
  if (!doc) {
    // No DOM available (SSR/build-time): strip tags textually as a fallback.
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  // Block-level elements become sentence breaks so flattened text stays readable.
  doc.body.querySelectorAll("p, li, br").forEach((node) => {
    node.append(" ");
  });
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
};

/** Extract list items as separate strings, for the legacy array columns. */
export const richTextToPlainList = (html: string | null | undefined): string[] => {
  if (!html) return [];
  const doc = parseToDocument(sanitizeRichText(html));
  if (!doc) return [];
  const items = Array.from(doc.body.querySelectorAll("li"))
    .map((node) => (node.textContent ?? "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (items.length) return items;
  // Content authored as paragraphs rather than a list still needs a usable projection.
  const fallback = richTextToPlainText(html);
  return fallback ? [fallback] : [];
};

/** True when markup carries no visible content (TipTap emits "<p></p>" when empty). */
export const isRichTextEmpty = (html: string | null | undefined): boolean =>
  richTextToPlainText(html).length === 0;

/**
 * Resolve the markup to render for a body field, preferring the rich-text column
 * and falling back to the legacy plain-text value for postings authored earlier.
 */
export const resolveRichText = (
  html: string | null | undefined,
  legacyPlainText: string | null | undefined,
): string => (isRichTextEmpty(html) ? plainTextToHtml(legacyPlainText) : sanitizeRichText(html));

export const resolveRichList = (
  html: string | null | undefined,
  legacyItems: string[] | null | undefined,
): string => (isRichTextEmpty(html) ? plainListToHtml(legacyItems) : sanitizeRichText(html));
