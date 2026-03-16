import type { Preview } from "@storybook/nextjs-vite";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "app",
      values: [
        { name: "app", value: "#ffffff" },
        { name: "surface", value: "#f9fafb" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background px-6 py-8 font-sans text-foreground">
        <div className="mx-auto max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;
