import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditorComponent = ({ onCodeChange, value, language }) => {
  // Map our subject names to Monaco's language IDs
  const getLanguage = (subject) => {
    switch (subject.toLowerCase()) {
      case "python":
        return "python";
      case "javascript":
        return "javascript";
      default:
        return "javascript"; // Default language
    }
  };

  return (
    <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height="40vh"
        language={getLanguage(language)}
        value={value}
        onChange={onCodeChange}
        theme="vs-dark" // A theme that matches our app's aesthetic
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
    </div>
  );
};

export default CodeEditorComponent;
