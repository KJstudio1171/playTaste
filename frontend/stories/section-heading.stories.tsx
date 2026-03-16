import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SectionHeading } from "@/components/section-heading";

const meta = {
  title: "Compositions/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
  args: {
    eyebrow: "최신 게임",
    title: "새로 출시된 게임들",
    description: "핵심 페이지들이 공유하는 섹션 타이틀 패턴입니다.",
    actionLabel: "전체 보기",
    actionHref: "/games",
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
