import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ReviewFeed } from "@/components/review-feed";

import { sampleReviews } from "./fixtures";

const meta = {
  title: "Compositions/ReviewFeed",
  component: ReviewFeed,
  tags: ["autodocs"],
  args: {
    reviews: sampleReviews,
    highlightReviewId: 1,
  },
} satisfies Meta<typeof ReviewFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Highlighted: Story = {};

export const Empty: Story = {
  args: {
    reviews: [],
  },
};
