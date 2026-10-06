import React from "react";
import { cn } from "@/lib/utils";

/**
 * Rendu Markdown léger et SÛR (aucun dangerouslySetInnerHTML : tout est converti en éléments React,
 * donc aucune injection HTML/XSS possible). Couvre la syntaxe produite par RichTextEditor :
 * ## / ### titres, - listes, > citations, **gras**, *italique*, [lien](https://...).
 */

/** Rendu inline : gras, italique, liens (http/https/mailto uniquement) */
const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;

    if (match[2]) {
      nodes.push(<strong key={key} className="font-semibold text-foreground">{match[2]}</strong>);
    } else if (match[4]) {
      nodes.push(<em key={key}>{match[4]}</em>);
    } else if (match[6] && match[7]) {
      const href = match[7];
      const safe = /^(https?:|mailto:)/i.test(href);
      nodes.push(
        safe ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline underline-offset-2 hover:text-primary/80">
            {match[6]}
          </a>
        ) : (
          <span key={key}>{match[6]}</span>
        )
      );
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let paragraph: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    const k = `ul-${blocks.length}`;
    blocks.push(
      <ul key={k} className="space-y-1.5 pl-1">
        {list.map((item, idx) => (
          <li key={idx} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden />
            <span>{renderInline(item, `${k}-${idx}`)}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const k = `p-${blocks.length}`;
    blocks.push(<p key={k}>{renderInline(paragraph.join(" "), k)}</p>);
    paragraph = [];
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    const k = `b-${blocks.length}`;

    if (!line) {
      flushList();
      flushParagraph();
    } else if (line.startsWith("### ")) {
      flushList();
      flushParagraph();
      blocks.push(<h3 key={k} className="text-lg font-bold text-foreground pt-2">{renderInline(line.slice(4), k)}</h3>);
    } else if (line.startsWith("## ")) {
      flushList();
      flushParagraph();
      blocks.push(<h2 key={k} className="text-xl font-extrabold text-foreground pt-2">{renderInline(line.slice(3), k)}</h2>);
    } else if (/^[-*] /.test(line)) {
      flushParagraph();
      list.push(line.slice(2));
    } else if (line.startsWith("> ")) {
      flushList();
      flushParagraph();
      blocks.push(
        <blockquote key={k} className="border-l-4 border-amber-400 bg-amber-500/5 rounded-r-lg px-4 py-2 italic text-foreground/80">
          {renderInline(line.slice(2), k)}
        </blockquote>
      );
    } else {
      flushList();
      paragraph.push(line);
    }
  });
  flushList();
  flushParagraph();

  return <div className={cn("space-y-3 leading-relaxed text-muted-foreground", className)}>{blocks}</div>;
};

/** Version texte brut (pour extraits de cartes et meta description) */
export const stripMarkdown = (content: string): string =>
  content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*>`]/g, "")
    .replace(/^\s*-\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
