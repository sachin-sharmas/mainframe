"use client";

import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [prevText, setPrevText] = useState(text);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  if (text !== prevText) {
    setPrevText(text);
    setDisplayed("");
    setDone(false);
  }

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));

        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
