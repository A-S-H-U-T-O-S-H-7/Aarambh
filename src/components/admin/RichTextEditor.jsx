// components/admin/shared/RichTextEditor.jsx
'use client';

import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

// Loading component as a separate function
const LoadingEditor = ({ isDark }) => (
  <div className={`rounded-xl border-2 p-4 ${isDark ? "border-gold/20 bg-brown-900" : "border-gold/30 bg-cream-50"}`}>
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-brown-700 rounded-lg" />
    </div>
  </div>
);

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <LoadingEditor isDark={false} />, // Default loading state
});

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
  placeholder = "Write your content here...",
  minHeight = "250px",
  showLabel = true,
  error = null,
  required = false,
  isDark = false,
}) {
  return (
    <div>
      {showLabel && (
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-cream-50/70" : "text-brown-700"}`}>
          {label} {required && <span className="text-divine-red">*</span>}
        </label>
      )}
      
      <div
        className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
          isDark
            ? "border-gold/20 hover:border-gold/40"
            : "border-gold/30 hover:border-gold/50"
        } ${error ? "border-divine-red" : ""}`}
      >
        <SunEditor
          onChange={onChange}
          setContents={value}
          defaultValue={value || ""}
          setOptions={{
            iframe: false,
            fullScreen: false,
            buttonList: [
              ["undo", "redo"],
              ["bold", "italic", "underline", "strike"],
              ["font", "fontSize", "formatBlock"],
              ["list", "align"],
              ["link", "image", "video"],
              ["removeFormat"],
            ],
            formats: {
              h1: "Heading 1",
              h2: "Heading 2",
              h3: "Heading 3",
              p: "Normal",
            },
            font: [
              "Arial",
              "Helvetica",
              "Times New Roman",
              "Georgia",
              "Impact",
              "Tahoma",
              "Verdana",
            ],
            fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36],
            minHeight: minHeight,
            height: "auto",
            placeholder: placeholder,
            width: "100%",
            buttonStyle: "soft",
            toolbarStickyTop: 0,
            attributesWhitelist: { all: "style" },
            colorList: [
              "#FF7A00", // Saffron
              "#F4B400", // Gold
              "#FFF8E7", // Cream
              "#2C1810", // Brown
              "#D32F2F", // Divine Red
              "#4FC3F7", // Sky Blue
              "#4CAF50", // Green
              "#6A1B9A", // Royal Purple
              "#000000", // Black
              "#FFFFFF", // White
            ],
            linkTargetNewWindow: true,
            showPathLabel: false,
            resizingBar: false,
            defaultStyle: `
              font-family: inherit;
              font-size: 14px;
              line-height: 1.6;
              background-color: ${isDark ? "#2C1810" : "#FFF8E7"};
              color: ${isDark ? "#FFF8E7" : "#2C1810"};
            `,
            katex: false,
          }}
          setDefaultStyle={`
            background-color: ${isDark ? "#2C1810" : "#FFF8E7"};
            border-radius: 0.75rem;
            min-height: ${minHeight};
            padding: 1rem;
            color: ${isDark ? "#FFF8E7" : "#2C1810"};
            border: none;
          `}
        />
      </div>
      
      {error && (
        <p className="text-divine-red text-sm mt-1">{error}</p>
      )}
    </div>
  );
}