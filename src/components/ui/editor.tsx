"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2,
  Undo,
  Redo,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type ActiveState = {
  bold: boolean;
  italic: boolean;
  h1: boolean;
  h2: boolean;
  ul: boolean;
  ol: boolean;
};

export function Editor({ value, onChange, placeholder, className }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [active, setActive] = useState<ActiveState>({ bold: false, italic: false, h1: false, h2: false, ul: false, ol: false });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const lastValueRef = useRef(value);

  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
  }, []);

  useEffect(() => {
    if (isMounted && editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
      lastValueRef.current = value;
    }
  }, [value, isMounted]);

  const updateActiveState = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      h1: document.queryCommandValue('formatBlock').toLowerCase() === 'h1',
      h2: document.queryCommandValue('formatBlock').toLowerCase() === 'h2',
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  const execCommand = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      lastValueRef.current = newValue;
      onChange(newValue);
    }
    editorRef.current?.focus();
    updateActiveState();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      lastValueRef.current = newValue;
      onChange(newValue);
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  if (!isMounted) return null;

  const btn = (cmd: string, val: string | undefined, isActive: boolean, icon: React.ReactNode) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); execCommand(cmd, val); }}
      className={cn(
        "h-8 w-8 p-0 flex items-center justify-center rounded-md transition-colors",
        isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"
      )}
    >
      {icon}
    </button>
  );

  return (
    <div className={cn("border rounded-md overflow-hidden bg-background", className)}>
      <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/50" onMouseUp={updateActiveState}>
        {btn("bold", undefined, active.bold, <Bold className="h-4 w-4" />)}
        {btn("italic", undefined, active.italic, <Italic className="h-4 w-4" />)}
        <div className="w-px h-4 bg-border mx-1" />
        {btn("formatBlock", "h1", active.h1, <Heading1 className="h-4 w-4" />)}
        {btn("formatBlock", "h2", active.h2, <Heading2 className="h-4 w-4" />)}
        <div className="w-px h-4 bg-border mx-1" />
        {btn("insertUnorderedList", undefined, active.ul, <List className="h-4 w-4" />)}
        {btn("insertOrderedList", undefined, active.ol, <ListOrdered className="h-4 w-4" />)}
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); addLink(); }}
          className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <div className="flex-1" />
        {btn("undo", undefined, false, <Undo className="h-4 w-4" />)}
        {btn("redo", undefined, false, <Redo className="h-4 w-4" />)}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={updateActiveState}
        onKeyUp={updateActiveState}
        className="min-h-[200px] p-4 focus:outline-none prose prose-slate max-w-none dark:prose-invert editor-content"
        data-placeholder={placeholder}
      />
      <style>{`
        .editor-content h1 { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
        .editor-content h2 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; }
        .editor-content p { margin-bottom: 0.5rem; }
        .editor-content div { margin-bottom: 0.5rem; }
        .editor-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.5rem; }
        .editor-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 0.5rem; }
        .editor-content li { margin-bottom: 0.25rem; }
      `}</style>
    </div>
  );
}
