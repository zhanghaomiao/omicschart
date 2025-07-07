import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DimPlot } from "./DimPlot";

// Generate sample dimensional reduction data for different cell types
const generateCellTypeData = (
  cellType: string,
  centerX: number,
  centerY: number,
  count: number = 200
) => {
  const data: number[][] = [];
  const spread = 3;

  for (let i = 0; i < count; i++) {
    const x = centerX + (Math.random() - 0.5) * spread;
    const y = centerY + (Math.random() - 0.5) * spread;
    data.push([x, y]);
  }

  return data;
};

const sampleDimPlotData = {
  "T cells": generateCellTypeData("T cells", -2, 3, 180),
  "B cells": generateCellTypeData("B cells", 4, 2, 150),
  "NK cells": generateCellTypeData("NK cells", -1, -3, 120),
  Monocytes: generateCellTypeData("Monocytes", 3, -2, 200),
  "Dendritic cells": generateCellTypeData("Dendritic cells", -4, 1, 80),
  Macrophages: generateCellTypeData("Macrophages", 2, 4, 160),
  Neutrophils: generateCellTypeData("Neutrophils", -3, -1, 140),
  Eosinophils: generateCellTypeData("Eosinophils", 1, -4, 90),
};

const sampleColorMap = {
  "T cells": "#FF6B6B",
  "B cells": "#4ECDC4",
  "NK cells": "#45B7D1",
  Monocytes: "#96CEB4",
  "Dendritic cells": "#FFEAA7",
  Macrophages: "#DDA0DD",
  Neutrophils: "#FFB347",
  Eosinophils: "#87CEEB",
};

const smallerDataset = {
  "CD4+ T cells": generateCellTypeData("CD4+ T cells", -1, 2, 100),
  "CD8+ T cells": generateCellTypeData("CD8+ T cells", 1, 2, 80),
  "B cells": generateCellTypeData("B cells", 2, -1, 90),
  Monocytes: generateCellTypeData("Monocytes", -2, -1, 110),
};

const smallerColorMap = {
  "CD4+ T cells": "#FF6B6B",
  "CD8+ T cells": "#4ECDC4",
  "B cells": "#45B7D1",
  Monocytes: "#96CEB4",
};

const meta: Meta<typeof DimPlot> = {
  title: "Components/DimPlot",
  component: DimPlot,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A dimensional reduction plot component using ECharts for visualizing single-cell data clustering. Supports various dimensionality reduction techniques like PCA, t-SNE, and UMAP with interactive zoom and pan functionality.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description:
        "Dimensional reduction data containing coordinates for each cell type",
      control: { type: "object" },
    },
    cellTypeColorMap: {
      description: "Color mapping for different cell types",
      control: { type: "object" },
    },
    title: {
      description: "Title of the dimensional reduction plot",
      control: { type: "text" },
    },
    chartType: {
      description: "Type of dimensional reduction (PCA, t-SNE, UMAP, etc.)",
      control: { type: "select" },
      options: ["PCA", "t-SNE", "UMAP", "PHATE", "DiffusionMap"],
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
    data: sampleDimPlotData,
    cellTypeColorMap: sampleColorMap,
    title: "Single-Cell RNA-seq UMAP",
    chartType: "UMAP",
  },
};

export const PCAVisualization: Story = {
  args: {
    data: smallerDataset,
    cellTypeColorMap: smallerColorMap,
    title: "Principal Component Analysis",
    chartType: "PCA",
  },
  parameters: {
    docs: {
      description: {
        story:
          "PCA visualization with a smaller dataset showing the first two principal components of the data.",
      },
    },
  },
};

export const TSNEVisualization: Story = {
  args: {
    data: sampleDimPlotData,
    cellTypeColorMap: sampleColorMap,
    title: "t-SNE Visualization of Cell Types",
    chartType: "t-SNE",
  },
  parameters: {
    docs: {
      description: {
        story:
          "t-SNE visualization showing non-linear dimensionality reduction of high-dimensional single-cell data.",
      },
    },
  },
};

export const WithoutTitle: Story = {
  args: {
    data: smallerDataset,
    cellTypeColorMap: smallerColorMap,
    chartType: "UMAP",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dimensional reduction plot without a title, showing clean visualization focused on the data points.",
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    data: {
      "Cluster 1": generateCellTypeData("Cluster 1", 0, 0, 150),
      "Cluster 2": generateCellTypeData("Cluster 2", 3, 3, 120),
      "Cluster 3": generateCellTypeData("Cluster 3", -3, 2, 100),
    },
    cellTypeColorMap: {
      "Cluster 1": "#e74c3c",
      "Cluster 2": "#3498db",
      "Cluster 3": "#2ecc71",
    },
    title: "Custom Color Scheme",
    chartType: "UMAP",
  },
  parameters: {
    docs: {
      description: {
        story: "Example with custom color scheme and generic cluster naming.",
      },
    },
  },
};
