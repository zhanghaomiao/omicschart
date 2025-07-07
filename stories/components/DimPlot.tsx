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

interface DimPlotData {
  [cellType: string]: number[][];
}

interface DimPlotProps {
  data: DimPlotData;
  cellTypeColorMap: { [cellType: string]: string };
  title?: string;
  chartType?: string;
}

const createDimPlotOption = (
  data: DimPlotData,
  cellTypeColorMap: { [cellType: string]: string },
  title?: string,
  chartType: string = "UMAP"
) => {
  const cellTypes = Object.keys(data);

  if (cellTypes.length === 0) {
    return {};
  }

  const series = cellTypes.map((cellType) => ({
    name: cellType,
    type: "scatter",
    data: data[cellType] as number[][],
    symbolSize: 2,
    large: true,
    animation: false,
    itemStyle: {
      color: cellTypeColorMap[cellType],
    },
  }));

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
        const cellType = params.seriesName;
        const [x, y] = params.value;
        return `
          <div style="font-weight: bold; color: #23255F;">Cell Type: ${cellType}</div>
          <div style="margin-top: 5px;">
            <div>${chartType.toUpperCase()}_1: ${x.toFixed(2)}</div>
            <div>${chartType.toUpperCase()}_2: ${y.toFixed(2)}</div>
          </div>
        `;
      },
    },
    legend: {
      data: cellTypes,
      type: "scroll",
      orient: "horizontal",
      top: title ? 40 : 0,
      left: "center",
      textStyle: {
        color: "#23255F",
        fontSize: 12,
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      selectedMode: "multiple",
      inactiveColor: "#ccc",
    },
    grid: {
      left: 80,
      right: 50,
      top: title ? 90 : 50,
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

export const DimPlot: React.FC<DimPlotProps> = ({
  data,
  cellTypeColorMap,
  title,
  chartType = "UMAP",
  ...props
}) => {
  const option = createDimPlotOption(data, cellTypeColorMap, title, chartType);

  return (
    <ChartContainer {...props}>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </ChartContainer>
  );
};
