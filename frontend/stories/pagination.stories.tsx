import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Pagination } from "@/components/pagination";

const meta = {
  title: "Compositions/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    page: 3,
    totalPages: 10,
    baseUrl: "/games",
    params: {
      sort: "rating",
      q: "metaphor",
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
