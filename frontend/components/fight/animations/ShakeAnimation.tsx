"use client";

import { useEffect, useRef } from "react";

type ShakeAnimationProps = {
  trigger: number;
  onEnd?: () => void;
};

export default function ShakeAnimation({
  trigger,
  onEnd,
}: ShakeAnimationProps) {

  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (trigger === 0) return;

    let cancelled = false;

    const play = async () => {
      await new Promise(resolve =>
        setTimeout(resolve, 800)
      );

      if (cancelled) return;

      onEndRef.current?.();
    };

    play();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  return null;
}