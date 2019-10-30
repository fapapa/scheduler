import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, shouldReplace = false) {
    if (shouldReplace) {
      history.pop();
    }

    setMode(newMode);
    setHistory([...history, newMode])
  };

  const back = function () {
    if (history.length > 1) {
      history.pop();
    }

    setMode(history.slice(-1)[0]);
  };

  return { mode, transition, back };
}
