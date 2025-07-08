import * as React from 'react';
import ReactECharts from 'echarts-for-react';

type TCGAChartData = Record<string, number[]>;

interface TCGAChartProps {
  chartType: 'scatter' | 'boxplot';
  data?: TCGAChartData;
  highlightLabel?: string;
}

// Constants
const DEFAULT_HIGHLIGHT = "CESC";
const COLORS = {
  DEFAULT: "#BC0000",
  ADJACENT: "#222222",
  HIGHLIGHT_TUMOR: "#5FAFF5",
  HIGHLIGHT_ADJACENT: "#A6E085",
  HIGHLIGHT_TUMOR_BORDER: "#409EFF",
  HIGHLIGHT_ADJACENT_BORDER: "#67C23A"
};

// Helper functions
const calculateMaxValue = (data: TCGAChartData): number => {
  const allValues = Object.values(data).flat();
  const maxValue = Math.max(...allValues);
  return Math.ceil(maxValue);
};

const calculateMean = (values: number[]): number => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const getColorForCategory = (name: string, highlightLabel: string): string => {
  if (name.startsWith(highlightLabel)) {
    return name.endsWith(':Tumor') ? COLORS.HIGHLIGHT_TUMOR : COLORS.HIGHLIGHT_ADJACENT;
  }
  return name.includes("Adjacent") ? COLORS.ADJACENT : COLORS.DEFAULT;
};

const getBorderColorForCategory = (name: string, highlightLabel: string): string => {
  if (name.startsWith(highlightLabel)) {
    return name.endsWith(':Tumor') ? COLORS.HIGHLIGHT_TUMOR_BORDER : COLORS.HIGHLIGHT_ADJACENT_BORDER;
  }
  return name.includes("Adjacent") ? COLORS.ADJACENT : COLORS.DEFAULT;
};

// Chart option generator
const getChartOption = (maxValue: number, chartType: string, categories?: string[]) => ({
  tooltip: {},
  animation: false,
  grid: {
    left: "3%",
    top: "8%",
    containLabel: true,
    right: "3%",
    bottom: "28%"
  },
  legend: {
    show: false
  },
  toolbox: {
    show: true,
    showTitle: true,
    top: 0,
    right: "1%",
    itemSize: 26,
  },
  xAxis: [
    {
      type: chartType === 'boxplot' ? "category" : "value",
      scale: true,
      axisLabel: {
        show: false
      },
      data: chartType === 'boxplot' ? categories : undefined,
      splitLine: {
        show: false
      },
      max: "dataMax"
    }
  ],
  yAxis: [
    {
      type: "value",
      name: "Gene expression:log2(1+TPM)",
      nameLocation: "center",
      nameRotate: 90,
      nameGap: 20,
      scale: true,
      max: maxValue,
      min: 0,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#ddd'
        }
      },
      axisTick: {
        show: true
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333"
        }
      },
      axisLabel: {
        show: true
      }
    }
  ],
});

// Scatter chart data constructor
const constructScatterSeries = (tcgaData: TCGAChartData, highlightLabel: string) => {
  let color = COLORS.DEFAULT;
  const space = 10;
  let acc_cnt = 0;

  return Object.entries(tcgaData).map(([name, expression]) => {
    const cnt = expression.length;
    const expression_mean = calculateMean(expression);
    const markPoint1Coord = [acc_cnt + space / 2, expression_mean];
    const markPoint2Coord = [acc_cnt + space / 2, 0];
    const data_xy = expression.map((data: number, index: number) =>
      [space / cnt * index + acc_cnt, data]
    );
    acc_cnt += space;

    color = getColorForCategory(name, highlightLabel);

    let markLine = null;
    if (name === `${highlightLabel}:Tumor` || name === `${highlightLabel}:Adjacent`) {
      markLine = {
        label: {
          show: true,
          color: color,
          formatter: "mean:{c}",
          position: "middle",
        },
        data: [{ yAxis: expression_mean }]
      };
    }

    const markPoint = {
      symbol: "rect",
      silent: true,
      symbolSize: [10, 2],
      itemStyle: { color },
      emphasis: { disabled: true },
      label: {
        position: "bottom",
        rotate: "85",
        fontSize: 12,
        fontWeight: "normal",
        align: "right",
        formatter: "{b}",
        color
      },
      data: [
        { coord: markPoint1Coord },
        {
          name,
          symbolSize: 1,
          coord: markPoint2Coord,
          label: { color }
        }
      ]
    };

    return {
      name: name,
      type: "scatter",
      symbolSize: 2,
      large: true,
      itemStyle: { color },
      markLine,
      markPoint,
      data: data_xy
    };
  });
};

// Boxplot chart data constructor
const constructBoxplotSeries = (tcgaData: TCGAChartData, highlightLabel: string) => {
  // Create data for each boxplot
  const boxData: number[][] = [];
  const categoryList: string[] = [];
  Object.entries(tcgaData).forEach(([name, expression]) => {
    const sortedData = [...expression].sort((a, b) => a - b);
    const q1 = sortedData[Math.floor(sortedData.length * 0.25)];
    const q2 = sortedData[Math.floor(sortedData.length * 0.5)];
    const q3 = sortedData[Math.floor(sortedData.length * 0.75)];
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];

    boxData.push([min, q1, q2, q3, max]);
    categoryList.push(name);
  });

  // Create markLines for mean values
  const markLineData: Array<{
    xAxis: number;
    yAxis: number;
    lineStyle: { color: string };
    label: { show: boolean; color: string; formatter: string; position: string; fontWeight: string };
  }> = [];

  Object.entries(tcgaData).forEach(([name, expression], index) => {
    if (name === `${highlightLabel}:Tumor` || name === `${highlightLabel}:Adjacent`) {
      const expression_mean = calculateMean(expression);
      const color = getColorForCategory(name, highlightLabel);

      markLineData.push({
        xAxis: index,
        yAxis: expression_mean,
        lineStyle: { color },
        label: {
          show: true,
          color,
          formatter: "mean:{c}",
          position: "middle",
          fontWeight: "bolder"
        }
      });
    }
  });

  // Create markPoints for category labels
  const markPointData = categoryList.map((name, index) => {
    const color = getColorForCategory(name, highlightLabel);

    return {
      name,
      symbolSize: 1,
      coord: [index, 0],
      itemStyle: { color },
      label: {
        color,
        position: "bottom",
        rotate: 85,
        fontSize: 12,
        fontWeight: "normal",
        align: "right",
        formatter: "{b}"
      },
      emphasis: { disabled: true }
    };
  });

  // Create boxplot series
  return [{
    type: 'boxplot',
    data: boxData,
    itemStyle: {
      borderWidth: 1,
      borderColor: (params: { dataIndex: number }) => {
        return getBorderColorForCategory(categoryList[params.dataIndex], highlightLabel);
      },
    },
    boxWidth: [15, 15],
    markLine: markLineData.length > 0 ? { data: markLineData } : undefined,
    markPoint: {
      data: markPointData,
      silent: true,
      symbol: 'rect',
      symbolSize: [10, 2]
    }
  }];
};

// Main component
export function TCGAChart({ chartType, data, highlightLabel = DEFAULT_HIGHLIGHT }: TCGAChartProps) {
  if (!data) {
    return <div>No data available</div>;
  }
  const maxValue = calculateMaxValue(data);
  const categories = Object.keys(data);
  const series = chartType === 'scatter'
    ? constructScatterSeries(data, highlightLabel)
    : constructBoxplotSeries(data, highlightLabel);

  const option = {
    ...getChartOption(maxValue, chartType, categories),
    series,
    animation: true,
    animationDuration: 500,
    animationEasing: 'cubicInOut'
  };

  return <ReactECharts key={chartType} option={option} style={{ height: '400px' }} />;
} 