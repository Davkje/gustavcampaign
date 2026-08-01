"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";
import {
  RiBold,
  RiItalic,
  RiLinkM,
  RiListUnordered,
  RiListOrdered,
  RiDoubleQuotesL,
} from "@remixicon/react";

// Enter ska alltid ge en enkel radbrytning (som <br>) istället för att
// skapa ett nytt stycke — annars är det otydligt vad skillnaden mellan
// Enter och Shift+Enter är. I listor/citat får Enter göra sitt vanliga
// jobb (ny punkt/rad) eftersom det behövs där.
const EnterAsLineBreak = Extension.create({
  name: "enterAsLineBreak",
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        if (this.editor.isActive("bulletList") || this.editor.isActive("orderedList") || this.editor.isActive("blockquote")) {
          return false;
        }
        // Alltid true — även om setHardBreak() av någon anledning inte
        // lyckas, ska Enter aldrig tillåtas falla igenom till standard-
        // beteendet (som delar upp i ett nytt stycke istället för radbrytning).
        this.editor.commands.setHardBreak();
        return true;
      },
    };
  },
});

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded p-1.5 ${
        active
          ? "bg-accent/20 text-accent"
          : "text-muted hover:bg-background hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function setLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Länk-URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t border border-b-0 border-border bg-background-elevated px-2 py-1.5">
      <ToolbarButton
        label="Fet text"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <RiBold size={18} />
      </ToolbarButton>
      <ToolbarButton
        label="Kursiv text"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <RiItalic size={18} />
      </ToolbarButton>
      <ToolbarButton label="Länk" active={editor.isActive("link")} onClick={setLink}>
        <RiLinkM size={18} />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolbarButton
        label="Punktlista"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <RiListUnordered size={18} />
      </ToolbarButton>
      <ToolbarButton
        label="Numrerad lista"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <RiListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        label="Citat"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <RiDoubleQuotesL size={18} />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (markdown: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      EnterAsLineBreak,
      Markdown.configure({
        html: false, // tillåt aldrig rå HTML i innehållet, bara det editorn själv kan producera
        breaks: true, // enkel radbrytning = ny rad, matchar tidigare beteende
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const { markdown } = editor.storage as unknown as {
        markdown: MarkdownStorage;
      };
      onChange(markdown.getMarkdown());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-24 rounded-b border border-border bg-background-elevated px-4 py-2 text-foreground outline-none focus:border-accent " +
          "[&_a]:text-accent [&_a]:underline [&_strong]:font-semibold " +
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 " +
          "[&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted",
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-24 rounded border border-border bg-background-elevated px-4 py-2 text-muted">
        Laddar redigerare…
      </div>
    );
  }

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
