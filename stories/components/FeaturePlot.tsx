import * as React from "react";
import ReactECharts from "echarts-for-react";
import styled from "styled-components";

const ChartContainer = styled.div`
  width: 100%;
  height: 600px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;


interface FeaturePlotProps {
  data: number[][];
  title?: string;
  chartType?: string;
  geneName?: string;
  colorRange?: [string, string];
}

const createFeaturePlotOption = (
  data: number[][],
  title?: string,
  chartType: string = "UMAP",
  geneName?: string,
  colorRange: [string, string] = ["#d3d3d3", "#210cfe"]
) => {
  if (!data || data.length === 0) {
    return {};
  }

  // Calculate max expression value for visualMap
  const maxValue = Math.max(...data.map(point => point[2] || 0));

  const series = [
    {
      name: geneName || "Expression",
      type: "scatter",
      data: data,
      symbolSize: 3,
      large: true,
      largeThreshold: 2000,
      animation: false,
    }
  ];

  const option = {
    title: title
      ? {
          text: title,
          left: "center",
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#23255F",
          },
        }
      : undefined,
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const point = data[params.dataIndex];
        return `
          <div style="font-weight: bold; color: #23255F;">${geneName || "Gene"}</div>
          <div style="margin-top: 5px;">
            <div>${chartType.toUpperCase()}_1: ${point[0].toFixed(2)}</div>
            <div>${chartType.toUpperCase()}_2: ${point[1].toFixed(2)}</div>
            <div>Expression: ${point[2].toFixed(2)}</div>
          </div>
        `;
      },
    },
    visualMap: {
      type: "continuous",
      min: 0,
      max: maxValue,
      inRange: {
        color: colorRange,
      },
      orient: "horizontal",
      left: "center",
      top: title ? 40 : 10,
      textStyle: {
        color: "#23255F",
        fontSize: 12,
      },
      calculable: true,
      dimension: 2,
      seriesIndex: 0,
      precision: 1,
      hoverLink: false,
      show: true,
    },
    grid: {
      left: 80,
      right: 50,
      top: title ? 90 : 60,
      bottom: 70,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: `${chartType.toUpperCase()}_1`,
      nameLocation: "middle",
      nameGap: 30,
      splitLine: null,
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#23255F",
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "#DBD6F6",
        },
      },
    },
    yAxis: {
      type: "value",
      name: `${chartType.toUpperCase()}_2`,
      nameLocation: "middle",
      nameGap: 30,
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#23255F",
        fontSize: 12,
      },
      splitLine: null,
      axisLine: {
        lineStyle: {
          color: "#DBD6F6",
        },
      },
    },
    dataZoom: [
      {
        type: "slider",
        backgroundColor: "#fff",
        selectedDataBackground: {
          lineStyle: {
            color: "#c1b7f5",
          },
          areaStyle: {
            color: "#e3dff8",
          },
        },
      },
      {
        type: "slider",
        orient: "vertical",
        left: "1%",
        backgroundColor: "#fff",
        selectedDataBackground: {
          lineStyle: {
            color: "#c1b7f5",
          },
          areaStyle: {
            color: "#e3dff8",
          },
        },
      },
    ],
    series: series,
  };

  return option;
};

export const FeaturePlot: React.FC<FeaturePlotProps> = ({
  data,
  title,
  chartType = "UMAP",
  geneName,
  colorRange = ["#d3d3d3", "#210cfe"],
}) => {
  const option = createFeaturePlotOption(data, title, chartType, geneName, colorRange);

  return (
    <ChartContainer>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </ChartContainer>
  );
}; 