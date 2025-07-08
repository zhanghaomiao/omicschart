import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeaturePlot } from "./FeaturePlot";

// Generate sample gene expression data
const generateExpressionData = (
  centerX: number,
  centerY: number,
  count: number = 1000,
  expressionPattern: "uniform" | "gradient" | "cluster" = "uniform"
) => {
  const data: number[][] = [];
  const spread = 5;

  for (let i = 0; i < count; i++) {
    const x = centerX + (Math.random() - 0.5) * spread;
    const y = centerY + (Math.random() - 0.5) * spread;
    
    let expression = 0;
    
    switch (expressionPattern) {
      case "uniform":
        expression = Math.random() * 10;
        break;
      case "gradient":
        // Higher expression towards the center
        const distance = Math.sqrt(x * x + y * y);
        expression = Math.max(0, 10 - distance * 2 + Math.random() * 2);
        break;
      case "cluster":
        // High expression in specific clusters
        const cluster1 = Math.sqrt((x + 2) * (x + 2) + (y - 2) * (y - 2));
        const cluster2 = Math.sqrt((x - 2) * (x - 2) + (y + 2) * (y + 2));
        if (cluster1 < 1.5 || cluster2 < 1.5) {
          expression = 8 + Math.random() * 4;
        } else {
          expression = Math.random() * 2;
        }
        break;
    }
    
    data.push([x, y, expression]);
  }

  return data;
};

const sampleFeatureData = [
  ...generateExpressionData(0, 0, 400, "uniform"),
  ...generateExpressionData(-3, 3, 100, "cluster"),
  ...generateExpressionData(3, -3, 100, "cluster"),
];


const meta: Meta<typeof FeaturePlot> = {
  title: "Components/FeaturePlot",
  component: FeaturePlot,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A feature plot component using ECharts for visualizing gene expression data on dimensional reduction plots. Supports continuous color mapping to show expression levels across cells.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: "Gene expression data with coordinates and expression values, [x, y, expression]",
      control: false,
    },
    title: {
      description: "Title of the feature plot",
      control: { type: "text" },
    },
    chartType: {
      description: "Type of dimensional reduction (PCA, t-SNE, UMAP, etc.)",
      control: { type: "select" },
      options: ["PCA", "t-SNE", "UMAP", "PHATE", "DiffusionMap"],
    },
    geneName: {
      description: "Name of the gene being visualized",
      control: { type: "text" },
    },
    colorRange: {
      description: "Color range for expression visualization [low, high]",
      control: { type: "object" },
    },
  },
  decorators: [
    (Story: any) => (
      <div style={{ width: "900px", height: "700px", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleFeatureData,
    title: "Gene Expression on UMAP",
    chartType: "UMAP",
    geneName: "CD3D",
    colorRange: ["#d3d3d3", "#210cfe"],
  },
};


export const CustomColorScheme: Story = {
  args: {
    data: sampleFeatureData,
    title: "Custom Color Scheme",
    chartType: "UMAP",
    geneName: "CD3D",
    colorRange: ["#ffebee", "#c62828"],
  },
  parameters: {
    docs: {
      description: {
        story: "Feature plot with a custom red color scheme for expression visualization.",
      },
    },
  },
};
