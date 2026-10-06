import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Link as LinkIcon,
  Eye,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Décrivez l'action solidaire en détail...",
  error,
}) => {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = `${prefix}${selectedText || "texte"}${suffix}`;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 5)
      );
    }, 0);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-input bg-background overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/40",
        error ? "border-destructive" : "border-border"
      )}
    >
      {/* Barre d'outils */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/40 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => applyFormat("**", "**")}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Gras (**texte**)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("*", "*")}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Italique (*texte*)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <button
            type="button"
            onClick={() => applyFormat("## ", "")}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Titre H2 (## Titre)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("### ", "")}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Titre H3 (### Sous-titre)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <button
            type="button"
            onClick={() => applyFormat("- ", "")}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Liste à puces (- élément)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("> ", "")}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Citation (> texte)"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat("[", "](https://)")}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Lien ([titre](url))"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Boutons Bascule Mode Édition / Aperçu */}
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
              tab === "edit"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Edit3 className="w-3.5 h-3.5" /> Édition
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
              tab === "preview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="w-3.5 h-3.5" /> Aperçu
          </button>
        </div>
      </div>

      {/* Zone de saisie ou aperçu */}
      {tab === "edit" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full p-4 bg-background text-sm text-foreground placeholder:text-muted-foreground/60 resize-y focus:outline-none min-h-[140px]"
        />
      ) : (
        <div className="p-4 bg-muted/10 min-h-[140px] text-sm">
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-muted-foreground italic text-xs">
              Aucun texte saisi pour l'aperçu.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
