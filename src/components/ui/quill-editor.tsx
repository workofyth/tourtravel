"use client";

import { useMemo, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Editor({ value, onChange, placeholder, className }: EditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      ["bold", "italic"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  }), []);

  const formats = [
    "header",
    "bold", "italic",
    "list",
    "link",
  ];

  const handleChange = useCallback((content: string) => {
    const clean = content.replace(/&nbsp;/g, " ");
    onChange(clean === "<p><br></p>" ? "" : clean);
  }, [onChange]);

  return (
    <div className={cn("quill-editor", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style>{`
        .quill-editor .ql-container {
          min-height: 200px;
          font-size: inherit;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: hsl(var(--border));
        }
        .quill-editor .ql-editor {
          min-height: 200px;
        }
        .quill-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: hsl(var(--border));
        }
        .quill-editor .ql-editor h1 { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
        .quill-editor .ql-editor h2 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; }
      `}</style>
    </div>
  );
}
