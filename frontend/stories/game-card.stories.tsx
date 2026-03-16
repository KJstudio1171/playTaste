import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GameCard } from "@/components/game-card";

import { compactGame, sampleGame } from "./fixtures";

const meta = {
  title: "Compositions/GameCard",
  component: GameCard,
  tags: ["autodocs"],
  args: {
    game: sampleGame,
  },
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    game: sampleGame,
  },
};

export const Compact: Story = {
  args: {
    game: compactGame,
    variant: "compact",
  },
  parameters: {
    layout: "centered",
  },
};
