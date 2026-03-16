import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "전체 보기",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "게임 둘러보기",
  },
};

export const AccentSurface: Story = {
  args: {
    variant: "outline",
    children: "에디터 추천",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "지우기",
  },
};
