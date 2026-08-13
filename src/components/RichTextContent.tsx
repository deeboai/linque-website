import { useMemo } from "react";
import { sanitizeRichText } from "@/lib/richText";
import { cn } from "@/lib/utils";

interface RichTextContentProps {
  html: string | null | undefined;
  className?: string;
}

/**
 * Renders admin-authored markup on public pages.
 *
 * Content is sanitized again here rather than trusting what came back from the
 * database — the write path is not the only way rows can change, so the render
 * path enforces the allowlist independently.
 */
export const RichTextContent = ({ html, className }: RichTextContentProps) => {
  const safeHtml = useMemo(() => sanitizeRichText(html), [html]);

  if (!safeHtml) return null;

  return (
    <div
      className={cn(
        "prose max-w-none prose-p:leading-relaxed prose-li:leading-relaxed",
        "prose-headings:text-foreground prose-strong:text-foreground",
        "prose-a:text-primary prose-a:underline",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default RichTextContent;
