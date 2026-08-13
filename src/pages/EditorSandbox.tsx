import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import RichTextContent from "@/components/RichTextContent";
import { richTextToPlainList, richTextToPlainText } from "@/lib/richText";

/**
 * Local-only harness for exercising the rich text editor without admin credentials.
 * Routed behind `import.meta.env.DEV`, so it does not exist in any deployed build.
 */
const EditorSandbox = () => {
  const [html, setHtml] = useState("<p>Type here, then try the toolbar.</p>");

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">Rich text editor sandbox (dev only)</h1>

      <RichTextEditor value={html} onChange={setHtml} minHeight="10rem" ariaLabel="Sandbox editor" />

      <section className="space-y-2">
        <h2 className="font-semibold">Rendered output</h2>
        <div className="rounded border p-4">
          <RichTextContent html={html} />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Stored markup</h2>
        <pre className="overflow-x-auto rounded bg-muted p-4 text-xs" data-testid="stored-html">
          {html}
        </pre>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Plain-text projection (SEO / JSON-LD)</h2>
        <pre className="overflow-x-auto rounded bg-muted p-4 text-xs" data-testid="plain-text">
          {richTextToPlainText(html)}
        </pre>
        <pre className="overflow-x-auto rounded bg-muted p-4 text-xs" data-testid="plain-list">
          {JSON.stringify(richTextToPlainList(html), null, 2)}
        </pre>
      </section>
    </div>
  );
};

export default EditorSandbox;
