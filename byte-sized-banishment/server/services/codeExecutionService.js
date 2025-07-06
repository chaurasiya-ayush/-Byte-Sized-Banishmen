import axios from "axios";
import config from "../config/index.js";

// Maps our subject names to Judge0's language IDs
const languageMap = {
  javascript: 63,
  python: 71,
  // Add other languages as needed
};

async function executeCode(sourceCode, language, testCases) {
  const languageId = languageMap[language.toLowerCase()];
  if (!languageId) {
    return {
      isCorrect: false,
      feedback: "Unsupported language for code execution.",
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
