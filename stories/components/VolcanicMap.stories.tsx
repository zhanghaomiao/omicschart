import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { VolcanicMap } from "./VolcanicMap";

// Sample volcanic plot data for demonstration
const generateVolcanicData = (count: number = 1000) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    const symbol = `Gene${i + 1}`;
    const Log2FC = (Math.random() - 0.5) * 8; // Range from -4 to 4
    const pval = Math.random() * 0.1; // P-value between 0 and 0.1
    const log10P = -Math.log10(pval); // Convert to -log10 scale

    // Determine direction based on Log2FC
    const direction = Log2FC > 0 ? "up" : "down";

    data.push({
      symbol,
      Log2FC,
      pval,
      "p.adj": pval * 1.2, // Adjusted p-value (simplified)
      direction,
      log10P,
    });
  }

  return data;
};

// Generate more realistic data with some significant hits
const generateRealisticVolcanicData = (count: number = 500) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    const symbol = `Gene${i + 1}`;
    let Log2FC, pval, log10P;

    // Create some significant upregulated genes (10% of data)
    if (i < count * 0.1) {
      Log2FC = Math.random() * 3 + 1.5; // Between 1.5 and 4.5
      pval = Math.random() * 0.01; // Very small p-values
      log10P = -Math.log10(pval);
    }
    // Create some significant downregulated genes (10% of data)
    else if (i < count * 0.2) {
      Log2FC = -(Math.random() * 3 + 1.5); // Between -1.5 and -4.5
      pval = Math.random() * 0.01; // Very small p-values
      log10P = -Math.log10(pval);
    }
    // Create non-significant genes (80% of data)
    else {
      Log2FC = (Math.random() - 0.5) * 2; // Between -1 and 1
      pval = Math.random() * 0.5 + 0.05; // Higher p-values
      log10P = -Math.log10(pval);
    }

    const direction = Log2FC > 0 ? "up" : "down";

    data.push({
      symbol,
      Log2FC,
      pval,
      "p.adj": pval * 1.2,
      direction,
      log10P,
    });
  }

  return data;
};

// Sample data with known significant genes
const sampleVolcanicData = generateRealisticVolcanicData(500);

const meta: Meta<typeof VolcanicMap> = {
  title: "Components/VolcanicMap",
  component: VolcanicMap,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A volcanic plot component using ECharts for visualizing differential gene expression analysis. Shows fold changes (Log2FC) vs statistical significance (-Log10 P-value) with adjustable color-coded significance thresholds. Red points indicate upregulated genes, blue points indicate downregulated genes, and gray points indicate non-significant genes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    plot_value: {
      description:
        "Array of gene expression data with fold changes and p-values",
      control: { type: "object" },
    },
    title: {
      description: "Title of the volcanic plot",
      control: { type: "text" },
    },
    log2FCThreshold: {
      description: "Threshold for Log2 fold change significance",
      control: { type: "number", min: 0, max: 5, step: 0.1 },
    },
    log10PThreshold: {
      description: "Threshold for -Log10 p-value significance",
      control: { type: "number", min: 0, max: 10, step: 0.1 },
    },
  },
  decorators: [
    (Story) => (
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
    plot_value: sampleVolcanicData,
    title: "Differential Gene Expression Analysis",
    log2FCThreshold: 1,
    log10PThreshold: 1.3,
  },
};

export const StrictThresholds: Story = {
  args: {
    plot_value: sampleVolcanicData,
    title: "Strict Significance Thresholds",
    log2FCThreshold: 2,
    log10PThreshold: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with stricter thresholds (Log2FC > 2, -Log10 P-value > 2) showing fewer significant genes.",
      },
    },
  },
};

export const RelaxedThresholds: Story = {
  args: {
    plot_value: sampleVolcanicData,
    title: "Relaxed Significance Thresholds",
    log2FCThreshold: 0.5,
    log10PThreshold: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with more relaxed thresholds (Log2FC > 0.5, -Log10 P-value > 1) showing more significant genes.",
      },
    },
  },
};
