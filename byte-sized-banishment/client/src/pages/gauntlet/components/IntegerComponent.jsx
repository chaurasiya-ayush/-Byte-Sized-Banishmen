const IntegerComponent = ({ onAnswerChange, value }) => {
  return (
    <div className="flex justify-center">
      <input
        type="number"
        value={value}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Enter your answer..."
        className="w-full max-w-sm text-center text-2xl px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
};

export default IntegerComponent;
