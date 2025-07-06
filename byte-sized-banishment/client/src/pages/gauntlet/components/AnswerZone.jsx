import React from "react";
import MCQComponent from "./MCQComponent";
import IntegerComponent from "./IntegerComponent";
import CodeEditorComponent from "./CodeEditorComponent"; 

const AnswerZone = ({ question, userAnswer, setUserAnswer }) => {
  switch (question.type) {
    case "mcq":
      return (
        <MCQComponent
          options={question.options}
          onAnswerSelect={setUserAnswer}
          selectedAnswer={userAnswer}
        />
      );
    case "integer":
      return (
        <IntegerComponent value={userAnswer} onAnswerChange={setUserAnswer} />
      );
    case "code": // <-- ADD NEW CASE
      return (
        <CodeEditorComponent
          language={question.subject}
          value={userAnswer}
          onCodeChange={setUserAnswer}
        />
      );
    default:
      return (
        <p className="text-center text-gray-500">Unsupported question type.</p>
      );
  }
};

export default AnswerZone;
