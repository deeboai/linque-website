import { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link2,
  Link2Off,
  Baseline,
  Highlighter,
  RemoveFormatting,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/richText";

/**
 * Fixed palettes rather than a free colour picker.
 *
 * An unrestricted picker makes it trivial to author pale-on-white text that fails
 * contrast requirements — a real problem on a careers page, where postings are read
 * on phones and by assistive tech. Every swatch below clears 4.5:1 against white
 * (text) or against near-black body copy (highlight).
 */
const TEXT_COLORS = [
  { label: "Default", value: null, swatch: "#1A1A1A" },
  { label: "Brand navy", value: "#262A4F", swatch: "#262A4F" },
  { label: "Brand purple", value: "#3B2E6B", swatch: "#3B2E6B" },
  { label: "Slate", value: "#4A4A57", swatch: "#4A4A57" },
  { label: "Green", value: "#1F6A46", swatch: "#1F6A46" },
  { label: "Red", value: "#B3261E", swatch: "#B3261E" },
  { label: "Amber", value: "#8A5A12", swatch: "#8A5A12" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", value: null, swatch: "#FFFFFF" },
  { label: "Yellow", value: "#FEF3C7", swatch: "#FEF3C7" },
  { label: "Peach", value: "#FDE4CF", swatch: "#FDE4CF" },
  { label: "Green", value: "#DCFCE7", swatch: "#DCFCE7" },
  { label: "Blue", value: "#DBEAFE", swatch: "#DBEAFE" },
  { label: "Purple", value: "#EDE9FE", swatch: "#EDE9FE" },
];

/**
 * Strip the markup Word smuggles in through the clipboard.
 *
 * ProseMirror's schema already drops anything it doesn't recognise, which handles
 * most of it. What survives that filter is inline `style` on otherwise-valid spans —
 * Word stamps explicit colours and fonts on every run, so a straight paste would
 * silently pin the text to Word's theme instead of the site's.
 */
const cleanPastedHtml = (html: string): string =>
  html
    // Word wraps chunks of proprietary markup in downlevel-revealed conditionals.
    .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
    .replace(/<\/?(?:o|w|m|v):[^>]*>/gi, "")
    .replace(/<(style|xml)[\s\S]*?<\/\1>/gi, "")
    // Drop colour, background and font declarations; keep the text, lose Word's theme.
    .replace(/\s(?:style|lang|class)="[^"]*"/gi, "")
    .replace(/\s(?:style|lang|class)='[^']*'/gi, "");

interface ColorPickerProps {
  icon: React.ReactNode;
  label: string;
  colors: Array<{ label: string; value: string | null; swatch: string }>;
  activeValue: string | null;
  onSelect: (value: string | null) => void;
}

const ColorPicker = ({ icon, label, colors, activeValue, onSelect }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          aria-label={label}
          title={label}
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <p className="px-1 pb-2 text-xs font-medium text-muted-foreground">{label}</p>
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color.label}
              type="button"
              title={color.label}
              aria-label={color.label}
              aria-pressed={activeValue === color.value}
              onClick={() => {
                onSelect(color.value);
                setOpen(false);
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded border transition",
                activeValue === color.value ? "border-primary ring-2 ring-primary/40" : "border-border",
              )}
            >
              <span
                className="h-5 w-5 rounded-sm border border-black/10"
                style={{ backgroundColor: color.swatch }}
              />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const LinkButton = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState("");

  const isActive = editor.isActive("link");

  const openPopover = (nextOpen: boolean) => {
    if (nextOpen) {
      setHref((editor.getAttributes("link").href as string) ?? "");
    }
    setOpen(nextOpen);
  };

  const applyLink = () => {
    const trimmed = href.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      // Bare domains would otherwise resolve as a relative path.
      const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(trimmed) ? trimmed : `https://${trimmed}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href: normalized }).run();
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={openPopover}>
        <PopoverTrigger asChild>
          <Toggle size="sm" pressed={isActive} aria-label="Insert link" title="Insert link" className="h-8 px-2">
            <Link2 className="h-4 w-4" aria-hidden="true" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          <div className="space-y-2">
            <Input
              value={href}
              onChange={(event) => setHref(event.target.value)}
              placeholder="https://example.com"
              aria-label="Link address"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={applyLink}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {isActive && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          aria-label="Remove link"
          title="Remove link"
          onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
        >
          <Link2Off className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
};

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1">
    <Toggle
      size="sm"
      className="h-8 px-2"
      pressed={editor.isActive("bold")}
      onPressedChange={() => editor.chain().focus().toggleBold().run()}
      aria-label="Bold"
      title="Bold (Ctrl+B)"
    >
      <Bold className="h-4 w-4" aria-hidden="true" />
    </Toggle>
    <Toggle
      size="sm"
      className="h-8 px-2"
      pressed={editor.isActive("italic")}
      onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      aria-label="Italic"
      title="Italic (Ctrl+I)"
    >
      <Italic className="h-4 w-4" aria-hidden="true" />
    </Toggle>
    <Toggle
      size="sm"
      className="h-8 px-2"
      pressed={editor.isActive("underline")}
      onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      aria-label="Underline"
      title="Underline (Ctrl+U)"
    >
      <UnderlineIcon className="h-4 w-4" aria-hidden="true" />
    </Toggle>

    <Separator orientation="vertical" className="mx-1 h-6" />

    <Toggle
      size="sm"
      className="h-8 px-2"
      pressed={editor.isActive("bulletList")}
      onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      aria-label="Bulleted list"
      title="Bulleted list"
    >
      <List className="h-4 w-4" aria-hidden="true" />
    </Toggle>
    <Toggle
      size="sm"
      className="h-8 px-2"
      pressed={editor.isActive("orderedList")}
      onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      aria-label="Numbered list"
      title="Numbered list"
    >
      <ListOrdered className="h-4 w-4" aria-hidden="true" />
    </Toggle>

    <Separator orientation="vertical" className="mx-1 h-6" />

    <LinkButton editor={editor} />

    <ColorPicker
      icon={<Baseline className="h-4 w-4" aria-hidden="true" />}
      label="Text colour"
      colors={TEXT_COLORS}
      activeValue={(editor.getAttributes("textStyle").color as string) ?? null}
      onSelect={(value) =>
        value
          ? editor.chain().focus().setColor(value).run()
          : editor.chain().focus().unsetColor().run()
      }
    />
    <ColorPicker
      icon={<Highlighter className="h-4 w-4" aria-hidden="true" />}
      label="Highlight"
      colors={HIGHLIGHT_COLORS}
      activeValue={(editor.getAttributes("highlight").color as string) ?? null}
      onSelect={(value) =>
        value
          ? editor.chain().focus().setHighlight({ color: value }).run()
          : editor.chain().focus().unsetHighlight().run()
      }
    />

    <Separator orientation="vertical" className="mx-1 h-6" />

    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 px-2"
      aria-label="Clear formatting"
      title="Clear formatting"
      onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
    >
      <RemoveFormatting className="h-4 w-4" aria-hidden="true" />
    </Button>
  </div>
);

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Rendered rows-worth of space before the editor scrolls. */
  minHeight?: string;
  id?: string;
  ariaLabel?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  minHeight = "8rem",
  id,
  ariaLabel,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Body fields are prose, not documents — page structure stays with the template.
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        code: false,
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "focus:outline-none",
        ...(id ? { id } : {}),
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      },
      transformPastedHTML: cleanPastedHtml,
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      // TipTap represents "empty" as an empty paragraph; store it as a true empty
      // string so downstream emptiness checks and fallbacks behave.
      onChange(html === "<p></p>" ? "" : sanitizeRichText(html));
    },
  });

  // Keep the editor in step when the form is reset to a different record.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    const current = editor.getHTML();
    if (incoming !== current && !(incoming === "" && current === "<p></p>")) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  const focusEditor = useCallback(() => editor?.chain().focus().run(), [editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
      <Toolbar editor={editor} />
      <div
        className="cursor-text px-3 py-2"
        style={{ minHeight }}
        onClick={focusEditor}
        role="presentation"
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none text-foreground prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-a:text-primary"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
