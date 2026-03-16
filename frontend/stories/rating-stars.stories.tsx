import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RatingStars } from "@/components/rating-stars";

const meta = {
  title: "Compositions/RatingStars",
  component: RatingStars,
  tags: ["autodocs"],
  args: {
    value: 4,
  },
} satisfies Meta<typeof RatingStars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};

export const LargeInteractive: Story = {
  args: {
    value: 5,
    interactive: true,
    size: "lg",
  },
};
