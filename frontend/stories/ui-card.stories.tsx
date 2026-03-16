import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  render: () => (
    <Card className="max-w-md rounded-[28px]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">이번 주 추천</p>
            <CardTitle className="mt-2 text-xl font-semibold">지금 주목받는 게임</CardTitle>
          </div>
          <Badge variant="accent">4.7</Badge>
        </div>
        <CardDescription>공통 패널, 헤더, 액션 배치를 확인하는 카드 예시입니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">
          기존 panel/card 계열을 `shadcn` primitive 위로 올린 후에도 현재 서비스 톤을 유지합니다.
        </p>
        <Button>자세히 보기</Button>
      </CardContent>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
