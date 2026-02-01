"use client";

import { ModernCardDeck } from "./ModernCardDeck";

export function CardDeck() {
  return (
    <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
      <ModernCardDeck />
    </div>
  );
}