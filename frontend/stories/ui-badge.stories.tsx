import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/components/badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "RPG",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: {
    variant: "accent",
    children: "4.7",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "저장 완료",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "실패",
  },
};
