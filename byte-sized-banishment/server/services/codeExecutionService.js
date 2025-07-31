import axios from "axios";
import config from "../config/index.js";

// Maps our subject names to Judge0's language IDs
const languageMap = {
  // Scripting Languages
  javascript: 63, // Node.js (12.14.0)
  python: 71, // Python (3.8.1)
  python3: 71, // Python (3.8.1)
  php: 68, // PHP (7.4.1)
  ruby: 72, // Ruby (2.7.0)

  // Compiled Languages
  c: 50, // C (GCC 9.2.0)
  "c++": 54, // C++ (GCC 9.2.0)
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
  "c#": 51, // C# (Mono 6.6.0.161)
  csharp: 51, // C# (Mono 6.6.0.161)

  // Modern Languages
  go: 60, // Go (1.13.5)
  golang: 60, // Go (1.13.5)
  rust: 73, // Rust (1.40.0)
  swift: 83, // Swift (5.2.3)
  kotlin: 78, // Kotlin (1.3.70)

  // Functional Languages
  haskell: 61, // Haskell (GHC 8.8.1)
  scala: 81, // Scala (2.13.2)

  // Other Popular Languages
  r: 80, // R (4.0.0)
  perl: 85, // Perl (5.28.1)
  lua: 64, // Lua (5.3.5)

  // Shell/Scripting
  bash: 46, // Bash (5.0.0)
  shell: 46, // Bash (5.0.0)

  // Assembly (if needed)
  assembly: 45, // Assembly (NASM 2.14.02)

  // SQL (for database questions)
  sql: 82, // SQL (SQLite 3.27.2)
  mysql: 82, // Using SQLite for MySQL compatibility

  // Web Technologies (if Judge0 supports them)
  typescript: 74, // TypeScript (3.7.4)

  // Add other languages as needed
};

async function executeCode(sourceCode, language, testCases) {
  const languageId = languageMap[language.toLowerCase()];
  if (!languageId) {
    const supportedLanguages = Object.keys(languageMap).join(", ");
    return {
      isCorrect: false,
      feedback: `Unsupported language: ${language}. Supported languages: ${supportedLanguages}`,
    };
  }

  // We'll check the code against each test case.
  for (const testCase of testCases) {
    const options = {
      method: "POST",
      url: `https://${config.JUDGE0_API_HOST}/submissions`,
      params: { base64_encoded: "false", wait: "true", fields: "*" },
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": config.JUDGE0_API_KEY,
        "X-RapidAPI-Host": config.JUDGE0_API_HOST,
      },
      data: {
        language_id: languageId,
        source_code: sourceCode,
        stdin: testCase.input,
        expected_output: testCase.output,
      },
    };

    try {
      const { data: result } = await axios.request(options);

      // Status ID 3 means "Accepted" (i.e., correct output)
      if (result.status.id !== 3) {
        let feedback = result.status.description;
        if (result.stderr) feedback += `\nError: ${result.stderr}`;
        if (result.compile_output)
          feedback += `\nCompile Output: ${result.compile_output}`;

        // If it fails any test case, we stop and return failure.
        return { isCorrect: false, feedback };
      }
    } catch (error) {
      console.error(
        "Error executing code with Judge0:",
        error.response?.data || error.message
      );
      return {
        isCorrect: false,
        feedback: "An error occurred while judging your code.",
      };
    }
  }

  // If all test cases passed
  return { isCorrect: true, feedback: "All test cases passed!" };
}

export { executeCode };
