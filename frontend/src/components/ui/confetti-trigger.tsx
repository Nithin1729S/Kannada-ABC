"use client";

import { triggerConfetti, triggerFireworks, triggerConfettiRain } from "../../lib/@props/confetti";

type ConfettiTriggerProps = {
  type?: "default" | "fireworks" | "rain";
};

export const useConfetti = () => {
  return {
    trigger: (type: "default" | "fireworks" | "rain" = "default") => {
      switch (type) {
        case "fireworks":
          triggerFireworks();
          break;
        case "rain":
          triggerConfettiRain();
          break;
        default:
          triggerConfetti();
      }
    }
  };
};