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

interface PlotData {
  symbol: string;
  Log2FC: number;
  pval: number;
  "p.adj": number;
  direction: string;
  log10P: number;
}

interface VolcanicMapProps {
  plot_value: PlotData[];
  title?: string;
  log2FCThreshold?: number;
  log10PThreshold?: number;
}

const createVolcanicMapOption = (
  plot_value: PlotData[],
  title?: string,
  log2FCThreshold: number = 1,
  log10PThreshold: number = 1.3
) => {
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
      : {
          left: "center",
          text: "Volcanic Map",
          textStyle: {
            color: "#23255F",
            fontSize: 20,
            fontWeight: "bold",
          },
        },
    textStyle: {
      fontFamily: "Harding",
    },
    grid: {
      left: "6%",
      right: "4%",
      top: title ? 90 : 60,
      bottom: "5%",
      containLabel: true,
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {},
        saveAsImage: {},
      },
      top: title ? 40 : 10,
    },
    tooltip: {
      enterable: true,
      confine: true,
      extraCssText:
        "max-width:600px;white-space: normal;word-break: break-all;font-size:14px;line-height: 1.5;",
      formatter: function (param: any) {
        const data = param.data as PlotData;
        return (
          '<div style="font-weight: bold; color: #23255F;">Symbol: ' +
          data.symbol +
          "</div>" +
          '<div style="margin-top: 5px;">' +
          "<div>Log2 (Fold-Change): " +
          data.Log2FC.toFixed(2) +
          "</div>" +
          "<div>-Log10 (P-value): " +
          data.log10P.toFixed(2) +
          "</div>" +
          "</div>"
        );
      },
    },
    xAxis: {
      type: "value",
      name: "Log2 (Fold-Change)",
      nameLocation: "center",
      nameGap: 20,
      axisLine: {
        onZero: false,
        lineStyle: {
          color: "#DBD6F6",
        },
      },
      nameTextStyle: {
        fontSize: 14,
        color: "#23255F",
      },
      axisLabel: {
        color: "#23255F",
        fontSize: 12,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: "-Log10 (P-value)",
      nameLocation: "center",
      axisLine: {
        onZero: false,
        lineStyle: {
          color: "#DBD6F6",
        },
      },
      nameGap: 20,
      nameTextStyle: {
        fontSize: 14,
        color: "#23255F",
      },
      axisLabel: {
        color: "#23255F",
        fontSize: 12,
      },
      splitLine: {
        show: false,
      },
    },
    legend: {
      data: ["Upregulated", "Downregulated", "Non-significant"],
      type: "scroll",
      orient: "horizontal",
      top: 40,
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
    series: [
      {
        name: "Upregulated",
        type: "scatter",
        data: plot_value
          .filter(
            (item) =>
              item.Log2FC > log2FCThreshold && item.log10P > log10PThreshold
          )
          .map((item) => ({
            ...item,
            value: [item.Log2FC, item.log10P],
          })),
        symbolSize: 4,
        large: true,
        animation: false,
        itemStyle: {
          color: "#dd4444",
        },
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            show: false,
          },
          lineStyle: {
            type: "dashed",
            color: "#999",
            width: 1,
          },
          data: [{ xAxis: log2FCThreshold }, { yAxis: log10PThreshold }],
        },
      },
      {
        name: "Downregulated",
        type: "scatter",
        data: plot_value
          .filter(
            (item) =>
              item.Log2FC < -log2FCThreshold && item.log10P > log10PThreshold
          )
          .map((item) => ({
            ...item,
            value: [item.Log2FC, item.log10P],
          })),
        symbolSize: 4,
        large: true,
        animation: false,
        itemStyle: {
          color: "#5181c6",
        },
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            show: false,
          },
          lineStyle: {
            type: "dashed",
            color: "#999",
            width: 1,
          },
          data: [{ xAxis: -log2FCThreshold }],
        },
      },
      {
        name: "Non-significant",
        type: "scatter",
        data: plot_value
          .filter(
            (item) =>
              !(
                item.Log2FC > log2FCThreshold && item.log10P > log10PThreshold
              ) &&
              !(item.Log2FC < -log2FCThreshold && item.log10P > log10PThreshold)
          )
          .map((item) => ({
            ...item,
            value: [item.Log2FC, item.log10P],
          })),
        symbolSize: 4,
        large: true,
        animation: false,
        itemStyle: {
          color: "#cfcfcf",
        },
      },
    ],
  };

  return option;
};

export const VolcanicMap: React.FC<VolcanicMapProps> = ({
  plot_value,
  title,
  log2FCThreshold = 1,
  log10PThreshold = 1.3,
  ...props
}) => {
  const option = createVolcanicMapOption(
    plot_value,
    title,
    log2FCThreshold,
    log10PThreshold
  );

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
