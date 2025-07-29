import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorComponent = ({ onCodeChange, value, language }) => {
  const [userSelectedLanguage, setUserSelectedLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  // Check if subject allows multiple language choices
  const isMultiLanguageSubject = (subject) => {
    if (!subject) return false;
    const subjectLower = subject.toLowerCase();
    return (
      subjectLower === "data structures" ||
      subjectLower === "algorithms" ||
      subjectLower === "dsa"
    );
  };

  // Get available languages for multi-language subjects
  const getAvailableLanguages = () => {
    return [
      { id: "javascript", name: "JavaScript", icon: "🟨" },
      { id: "python", name: "Python", icon: "🐍" },
      { id: "java", name: "Java", icon: "☕" },
      { id: "cpp", name: "C++", icon: "⚡" },
    ];
  };

  // Set up available languages when component mounts or language prop changes
  useEffect(() => {
    if (isMultiLanguageSubject(language)) {
      const languages = getAvailableLanguages();
      setAvailableLanguages(languages);
      // Set default to JavaScript if no user selection
      if (!userSelectedLanguage) {
        setUserSelectedLanguage("javascript");
      }
    } else {
      setAvailableLanguages([]);
      setUserSelectedLanguage(null);
    }
  }, [language, userSelectedLanguage]);

  // Map our subject names to Monaco's language IDs
  const getLanguage = (subject) => {
    if (!subject) return "javascript"; // Default fallback

    const subjectLower = subject.toLowerCase();

    // For multi-language subjects, use user's choice
    if (isMultiLanguageSubject(subject) && userSelectedLanguage) {
      return userSelectedLanguage;
    }

    // Programming languages mapping
    switch (subjectLower) {
      case "python":
        return "python";
      case "javascript":
      case "js":
        return "javascript";
      case "java":
        return "java";
      case "c":
        return "c";
      case "c++":
      case "cpp":
        return "cpp";
      case "c#":
      case "csharp":
        return "csharp";
      case "php":
        return "php";
      case "ruby":
        return "ruby";
      case "go":
      case "golang":
        return "go";
      case "rust":
        return "rust";
      case "swift":
        return "swift";
      case "kotlin":
        return "kotlin";
      case "scala":
        return "scala";
      case "r":
        return "r";
      case "sql":
      case "mysql":
      case "postgresql":
        return "sql";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      case "xml":
        return "xml";
      case "yaml":
      case "yml":
        return "yaml";
      case "typescript":
      case "ts":
        return "typescript";
      case "shell":
      case "bash":
        return "shell";
      case "powershell":
        return "powershell";
      // For subjects that aren't direct programming languages
      case "data structures":
      case "algorithms":
      case "dsa":
        return userSelectedLanguage || "javascript"; // Use user choice or default to JavaScript
      case "database":
      case "dbms":
        return "sql";
      case "web development":
      case "frontend":
        return "javascript";
      case "backend":
        return "javascript";
      default:
        // Try to extract language from subject name if it contains known keywords
        if (subjectLower.includes("python")) return "python";
        if (subjectLower.includes("java")) return "java";
        if (subjectLower.includes("javascript") || subjectLower.includes("js"))
          return "javascript";
        if (subjectLower.includes("c++") || subjectLower.includes("cpp"))
          return "cpp";
        if (subjectLower.includes("sql")) return "sql";

        return "javascript"; // Ultimate fallback
    }
  };

  // Get language-specific default code templates
  const getDefaultTemplate = (selectedLanguage) => {
    switch (selectedLanguage) {
      case "python":
        return "def solution():\n    # Your code here\n    pass";
      case "java":
        return "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n    \n    // Add your solution method here\n    public static int solutionMethod() {\n        // Your code here\n        return 0;\n    }\n}";
      case "cpp":
        return "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}\n\n// Add your solution function here\nint solutionFunction() {\n    // Your code here\n    return 0;\n}";
      case "c":
        return "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}";
      case "csharp":
        return "using System;\n\nclass Program {\n    static void Main() {\n        // Your code here\n    }\n}";
      case "sql":
        return "-- Your SQL query here\nSELECT * FROM table_name;";
      case "typescript":
        return "function solution(): any {\n    // Your code here\n}";
      case "javascript":
      default:
        return "function solution() {\n    // Your code here\n}";
    }
  };

  const selectedLanguage = getLanguage(language);
  const defaultTemplate = getDefaultTemplate(selectedLanguage);

  // Use default template if no value is provided
  const editorValue = value || defaultTemplate;

  const handleReset = () => {
    onCodeChange(defaultTemplate);
  };

  const handleLanguageChange = (newLanguage) => {
    setUserSelectedLanguage(newLanguage);
    // Reset code to new language template
    const newTemplate = getDefaultTemplate(newLanguage);
    onCodeChange(newTemplate);
  };

  return (
    <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 font-mono">
            Language:{" "}
            <span className="text-red-400 font-semibold">
              {selectedLanguage.toUpperCase()}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
              title="Reset to default template"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Language Selector for Multi-Language Subjects */}
        {availableLanguages.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-mono">
                Choose Language:
              </span>
              {availableLanguages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`text-xs px-2 py-1 rounded transition-all duration-200 font-mono flex items-center gap-1 ${
                    selectedLanguage === lang.id
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  title={`Switch to ${lang.name}`}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Editor
        height="40vh"
        language={selectedLanguage}
        value={editorValue}
        onChange={onCodeChange}
        theme="vs-dark" // A theme that matches our app's aesthetic
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastColumn: 5,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: "always",
          matchBrackets: "always",
          autoIndent: "full",
          formatOnType: true,
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
        }}
      />
    </div>
  );
};

export default CodeEditorComponent;
