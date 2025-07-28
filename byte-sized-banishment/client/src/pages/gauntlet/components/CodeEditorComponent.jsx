import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { FaJs, FaPython, FaJava } from "react-icons/fa";
import { SiCplusplus, SiJavascript } from "react-icons/si";
import { FaBolt, FaCode, FaUser } from "react-icons/fa";

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
      {
        id: "javascript",
        name: "JavaScript",
        icon: <SiJavascript className="text-yellow-400" />,
      },
      {
        id: "python",
        name: "Python",
        icon: <FaPython className="text-blue-400" />,
      },
      { id: "java", name: "Java", icon: <FaJava className="text-red-400" /> },
      {
        id: "cpp",
        name: "C++",
        icon: <SiCplusplus className="text-blue-600" />,
      },
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
    <div className="border-2 border-red-600/50 rounded-lg overflow-hidden bg-gradient-to-br from-black/60 to-red-900/20 backdrop-blur-sm shadow-2xl">
      <div className="bg-gradient-to-r from-black/80 to-red-900/40 px-4 py-3 border-b border-red-600/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-orange-400">
              <FaCode />
            </span>
            <span
              className="text-sm text-gray-200 font-mono"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Language:{" "}
              <span className="text-red-400 font-semibold text-lg">
                {selectedLanguage.toUpperCase()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs px-3 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-lg transition-all duration-200 font-bold border border-red-500/50"
              style={{
                fontFamily: "'Orbitron', monospace",
                boxShadow: "0 0 10px rgba(220, 38, 38, 0.3)",
              }}
              title="Reset to default template"
            >
              🔄 Reset Code
            </button>
          </div>
        </div>

        {/* Language Selector for Multi-Language Subjects */}
        {availableLanguages.length > 0 && (
          <div className="mt-3 pt-3 border-t border-red-600/30">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs text-orange-400 font-mono font-bold flex items-center gap-1"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                <FaBolt className="text-orange-400" />
                Choose Your Weapon:
              </span>
              {availableLanguages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`text-xs px-3 py-2 rounded-lg transition-all duration-200 font-mono flex items-center gap-2 border ${
                    selectedLanguage === lang.id
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg border-red-400"
                      : "bg-black/50 text-gray-300 hover:bg-red-900/30 border-red-700/50 hover:border-red-500/70"
                  }`}
                  style={{
                    boxShadow:
                      selectedLanguage === lang.id
                        ? "0 0 15px rgba(220, 38, 38, 0.5)"
                        : "0 0 5px rgba(0, 0, 0, 0.3)",
                  }}
                  title={`Switch to ${lang.name}`}
                >
                  <span className="text-lg">{lang.icon}</span>
                  <span style={{ fontFamily: "'Orbitron', monospace" }}>
                    {lang.name}
                  </span>
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
