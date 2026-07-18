import dynamic from "next/dynamic";

export const Editor = dynamic(
  () => import("./quill-editor").then((m) => m.Editor),
  { ssr: false }
);
