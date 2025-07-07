import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SurvivalChart } from "./SurvivalChart";

// Sample survival data for demonstration
const sampleSurvivalData = {
  high: [
    [0, 1.0],
    [6, 0.95],
    [12, 0.88],
    [18, 0.82],
    [24, 0.75],
    [30, 0.68],
    [36, 0.62],
    [42, 0.55],
    [48, 0.48],
    [54, 0.42],
    [60, 0.35],
  ],
  low: [
    [0, 1.0],
    [6, 0.92],
    [12, 0.85],
    [18, 0.78],
    [24, 0.7],
    [30, 0.61],
    [36, 0.52],
    [42, 0.43],
    [48, 0.34],
    [54, 0.26],
    [60, 0.18],
  ],
};

const meta: Meta<typeof SurvivalChart> = {
  title: "Components/SurvivalChart",
  component: SurvivalChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A survival analysis chart component using ECharts for visualizing survival probabilities over time for different expression groups.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description:
        "Survival data containing high and low expression group data points",
      control: { type: "object" },
    },
    title: {
      description: "Title of the survival chart",
      control: { type: "text" },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "800px", height: "600px", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleSurvivalData,
    title: "Gene Expression Survival Analysis",
  },
};

export const CustomTitle: Story = {
  args: {
    data: sampleSurvivalData,
    title: "BRCA1 Expression Impact on Overall Survival",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with a custom title showing how the chart can be used for specific gene analysis.",
      },
    },
  },
};
