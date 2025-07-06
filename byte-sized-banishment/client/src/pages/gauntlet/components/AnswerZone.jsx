import React from "react";
import MCQComponent from "./MCQComponent";
import IntegerComponent from "./IntegerComponent";
// Import CodeEditorComponent when you build it

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
    // case 'code':
    //     return <CodeEditorComponent value={userAnswer} onCodeChange={setUserAnswer} />;
    default:
      return (
        <p className="text-center text-gray-500">Unsupported question type.</p>
      );
  }
};

export default AnswerZone;
