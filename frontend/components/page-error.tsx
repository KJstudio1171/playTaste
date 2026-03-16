"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PageErrorProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function PageError({ title, description, onRetry }: PageErrorProps) {
  return (
    <Card className="rounded-[32px] p-8">
      <p className="eyebrow">오류</p>
      <h1 className="display-title mt-3 flex items-center gap-2 text-4xl font-semibold">
        <AlertTriangle className="h-7 w-7 text-danger-text" />
        <span>{title}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      {onRetry ? (
        <Button type="button" onClick={onRetry} className="mt-6">
          다시 시도
        </Button>
      ) : null}
    </Card>
  );
}
