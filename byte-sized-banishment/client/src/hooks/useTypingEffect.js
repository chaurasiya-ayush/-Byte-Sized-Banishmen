import { useState, useEffect } from "react";

const useTypingEffect = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset when text changes
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return displayedText;
};

export { useTypingEffect };
