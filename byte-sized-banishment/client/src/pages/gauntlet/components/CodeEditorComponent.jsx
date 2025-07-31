import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { FaJs, FaPython, FaJava } from "react-icons/fa";
import { SiCplusplus, SiJavascript } from "react-icons/si";
import { FaBolt, FaCode, FaUser } from "react-icons/fa";

const CodeEditorComponent = ({ onCodeChange, value, language, question }) => {
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

  // Get language-specific default code templates with input/output handling
  const getDefaultTemplate = (selectedLanguage) => {
    switch (selectedLanguage) {
      case "python":
        return `# Read input from stdin and write output to stdout
# Example: For input "5 3", use: a, b = map(int, input().split())

def solution():
    """
    Write your solution here.
    Read input using input() function
    Print output using print() function
    """
    # Example input reading:
    # line = input().strip()
    # numbers = list(map(int, input().split()))
    
    # Your code here
    pass

# Call your solution
solution()`;

      case "java":
        return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Example input reading:
        // int n = scanner.nextInt();
        // String line = scanner.nextLine();
        // int[] arr = new int[n];
        // for(int i = 0; i < n; i++) {
        //     arr[i] = scanner.nextInt();
        // }
        
        // Call your solution method and print result
        // System.out.println(solutionMethod());
        
        scanner.close();
    }
    
    // Write your solution method here
    public static int solutionMethod() {
        // Your code here
        return 0;
    }
}`;

      case "cpp":
        return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    // Example input reading:
    // int n;
    // cin >> n;
    // 
    // string line;
    // getline(cin, line);
    //
    // vector<int> arr(n);
    // for(int i = 0; i < n; i++) {
    //     cin >> arr[i];
    // }
    
    // Call your solution function
    // cout << solutionFunction() << endl;
    
    return 0;
}

// Write your solution function here
int solutionFunction() {
    // Your code here
    return 0;
}`;

      case "c":
        return `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Example input reading:
    // int n;
    // scanf("%d", &n);
    //
    // char line[1000];
    // fgets(line, sizeof(line), stdin);
    //
    // int arr[100];
    // for(int i = 0; i < n; i++) {
    //     scanf("%d", &arr[i]);
    // }
    
    // Call your solution function
    // printf("%d\\n", solutionFunction());
    
    return 0;
}

// Write your solution function here
int solutionFunction() {
    // Your code here
    return 0;
}`;

      case "csharp":
        return `using System;
using System.Linq;

class Program {
    static void Main() {
        // Example input reading:
        // int n = int.Parse(Console.ReadLine());
        // string line = Console.ReadLine();
        // int[] arr = Console.ReadLine().Split().Select(int.Parse).ToArray();
        
        // Call your solution method
        // Console.WriteLine(SolutionMethod());
    }
    
    // Write your solution method here
    static int SolutionMethod() {
        // Your code here
        return 0;
    }
}`;

      case "javascript":
      default:
        return `// For Node.js, read from stdin and write to stdout
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Example input reading:
// rl.on('line', (line) => {
//     const numbers = line.split(' ').map(Number);
//     console.log(solution(numbers));
//     rl.close();
// });

function solution() {
    /**
     * Write your solution here.
     * Read input using readline interface
     * Print output using console.log()
     */
    // Your code here
    return null;
}

// For simple single-line input:
rl.question('', (input) => {
    // Process input and call solution
    console.log(solution());
    rl.close();
});`;

      case "sql":
        return `-- Write your SQL query here
-- The query will be executed against the provided database schema
-- Example: SELECT column_name FROM table_name WHERE condition;

SELECT * FROM table_name;`;

      case "typescript":
        return `// For Node.js TypeScript, read from stdin and write to stdout
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function solution(): any {
    /**
     * Write your solution here.
     * Read input using readline interface
     * Print output using console.log()
     */
    // Your code here
    return null;
}

// For simple single-line input:
rl.question('', (input: string) => {
    // Process input and call solution
    console.log(solution());
    rl.close();
});`;
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
      {/* Coding Guidelines Banner */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-b border-yellow-600/30 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-yellow-300">
          <FaBolt className="text-yellow-400" />
          <span style={{ fontFamily: "'Orbitron', monospace" }}>
            💡 <strong>Tip:</strong> Your code will be executed with real test
            cases using Judge0 API. Check the Input/Output examples below and
            ensure your code reads from stdin and writes to stdout!
          </span>
        </div>
      </div>

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

      {/* Input/Output Examples Section */}
      {question && question.testCases && question.testCases.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-blue-600/30 px-4 py-3">
          <h4
            className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            <FaCode className="text-blue-400" />
            Input/Output Examples:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {question.testCases.slice(0, 2).map((testCase, index) => (
              <div
                key={index}
                className="bg-black/40 rounded-lg p-3 border border-blue-700/30"
              >
                <div className="mb-2">
                  <span className="text-green-400 font-mono font-bold">
                    Input:
                  </span>
                  <pre className="text-gray-300 mt-1 bg-black/60 p-2 rounded text-xs overflow-x-auto">
                    {testCase.input || "No input"}
                  </pre>
                </div>
                <div>
                  <span className="text-orange-400 font-mono font-bold">
                    Expected Output:
                  </span>
                  <pre className="text-gray-300 mt-1 bg-black/60 p-2 rounded text-xs overflow-x-auto">
                    {testCase.output || "No output"}
                  </pre>
                </div>
              </div>
            ))}
          </div>
          {question.testCases.length > 2 && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              + {question.testCases.length - 2} more test case(s) will be used
              for evaluation
            </p>
          )}
        </div>
      )}

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
