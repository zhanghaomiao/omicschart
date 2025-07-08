import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GeneExpressionChart } from "./GeneExpressionChart";

// Generate sample gene expression data
const generateExpressionData = (
  groupName: string,
  count: number = 100,
  mean: number = 5,
  std: number = 2,
  includeNulls: boolean = false
) => {
  const values: (number | null | undefined)[] = [];
  
  for (let i = 0; i < count; i++) {
    if (includeNulls && Math.random() < 0.1) {
      values.push(null);
    } else if (includeNulls && Math.random() < 0.05) {
      values.push(undefined);
    } else {
      // Generate normally distributed data
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const value = mean + z0 * std;
      values.push(Math.max(0, value)); // Ensure non-negative values
    }
  }
  
  return values.sort((a, b) => (a || 0) - (b || 0));
};

const sampleGeneExpressionData = {
  "Dataset1": {
    "Control": generateExpressionData("Control", 150, 3, 1.5),
    "Treatment": generateExpressionData("Treatment", 150, 7, 2.5),
    "High_Dose": generateExpressionData("High_Dose", 100, 12, 3),
  },
  "Dataset2": {
    "Wild_Type": generateExpressionData("Wild_Type", 120, 4, 1.8),
    "Mutant": generateExpressionData("Mutant", 120, 8, 2.2),
    "Knockout": generateExpressionData("Knockout", 80, 1, 0.8),
  },
  "Dataset3": {
    "Normal": generateExpressionData("Normal", 200, 5, 2),
    "Disease": generateExpressionData("Disease", 200, 9, 3),
  }
};

const sampleDataWithNulls = {
  "Dataset1": {
    "Control": generateExpressionData("Control", 150, 3, 1.5, true),
    "Treatment": generateExpressionData("Treatment", 150, 7, 2.5, true),
  },
  "Dataset2": {
    "Wild_Type": generateExpressionData("Wild_Type", 120, 4, 1.8, true),
    "Mutant": generateExpressionData("Mutant", 120, 8, 2.2, true),
  }
};

const meta: Meta<typeof GeneExpressionChart> = {
  title: "Components/GeneExpressionChart",
  component: GeneExpressionChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A gene expression chart component using ECharts for visualizing gene expression data across different groups and datasets. Uses a scatter plot layout with alternating background shading for different datasets.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: "Gene expression data organized by dataset and group",
      control: false,
    },
    title: {
      description: "Title of the gene expression chart",
      control: { type: "text" },
    },
    geneName: {
      description: "Name of the gene being visualized",
      control: { type: "text" },
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
    data: sampleGeneExpressionData,
    title: "Gene Expression Across Groups",
    geneName: "CD3D",
  },
};

export const WithNullValues: Story = {
  args: {
    data: sampleDataWithNulls,
    title: "Gene Expression with Missing Data",
    geneName: "TP53",
  },
  parameters: {
    docs: {
      description: {
        story: "Gene expression chart showing data with null and undefined values, demonstrating how the component handles missing data.",
      },
    },
  },
};


export const HighExpressionVariation: Story = {
  args: {
    data: {
      "Dataset1": {
        "Low_Expression": generateExpressionData("Low_Expression", 80, 1, 0.5),
        "Medium_Expression": generateExpressionData("Medium_Expression", 80, 5, 1.5),
        "High_Expression": generateExpressionData("High_Expression", 80, 15, 4),
      },
      "Dataset2": {
        "Very_Low": generateExpressionData("Very_Low", 60, 0.5, 0.3),
        "Very_High": generateExpressionData("Very_High", 60, 20, 5),
      }
    },
    title: "High Expression Variation",
    geneName: "MYC",
  },
  parameters: {
    docs: {
      description: {
        story: "Gene expression chart showing groups with high variation in expression levels.",
      },
    },
  },
}; 