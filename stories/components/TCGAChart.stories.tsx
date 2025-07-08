'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TCGAChart } from './TCGAChart';

// Generate mock TCGA-like data
const generateTCGAData = (
  tumorTypes: string[] = ['CESC', 'BRCA', 'LUAD', 'COAD'],
  samplesPerType: number = 50,
  expressionRange: { min: number; max: number } = { min: 1.0, max: 8.0 }
) => {
  const data: Record<string, number[]> = {};
  
  tumorTypes.forEach(tumorType => {
    // Generate tumor data (higher expression)
    const tumorMean = expressionRange.min + (expressionRange.max - expressionRange.min) * 0.7;
    const tumorStd = (expressionRange.max - expressionRange.min) * 0.15;
    const tumorData = Array.from({ length: samplesPerType }, () => {
      const value = tumorMean + (Math.random() - 0.5) * tumorStd * 2;
      return Math.max(expressionRange.min, Math.min(expressionRange.max, value));
    }).sort((a, b) => a - b); // Sort from min to max
    data[`${tumorType}:Tumor`] = tumorData;
    
    // Generate adjacent data (lower expression)
    const adjacentMean = expressionRange.min + (expressionRange.max - expressionRange.min) * 0.3;
    const adjacentStd = (expressionRange.max - expressionRange.min) * 0.1;
    const adjacentData = Array.from({ length: samplesPerType }, () => {
      const value = adjacentMean + (Math.random() - 0.5) * adjacentStd * 2;
      return Math.max(expressionRange.min, Math.min(expressionRange.max, value));
    }).sort((a, b) => a - b); // Sort from min to max
    data[`${tumorType}:Adjacent`] = adjacentData;
  });
  
  return data;
};

// Generate different datasets for different scenarios
const sampleData = generateTCGAData(['CESC', 'BRCA', 'LUAD', 'COAD'], 50);

const meta: Meta<typeof TCGAChart> = {
  title: 'Components/TCGAChart',
  component: TCGAChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'TCGAChart visualizes gene expression data using scatter and boxplot charts with ECharts. Highlights specific tumor and adjacent categories.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    chartType: {
      control: { type: 'select' },
      options: ['scatter', 'boxplot'],
      description: 'Type of chart to display',
    },
    data: {
      control: false,
      description: 'TCGA gene expression data',
    },
    highlightLabel: {
      control: { type: 'text' },
      description: 'Tumor type to highlight (e.g., CESC, BRCA)',
    },
  },
  decorators: [
    (Story: any) => (
      <div style={{ width: '900px', height: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ScatterChart: Story = {
  args: {
    chartType: 'scatter',
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scatter plot of gene expression for tumor and adjacent samples.',
      },
    },
  },
};

export const BoxplotChart: Story = {
  args: {
    chartType: 'boxplot',
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Boxplot of gene expression for tumor and adjacent samples.',
      },
    },
  },
};

export const HighlightBRCA: Story = {
  args: {
    chartType: 'boxplot',
    data: sampleData,
    highlightLabel: 'BRCA',
  },
  parameters: {
    docs: {
      description: {
        story: 'Boxplot with BRCA tumor type highlighted instead of the default CESC.',
      },
    },
  },
};
