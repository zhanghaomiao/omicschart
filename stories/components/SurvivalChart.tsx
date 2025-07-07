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

interface SurvivalData {
  high: number[][];
  low: number[][];
}

interface SurvivalChartProps {
  data: SurvivalData;
  title: string;
}

const createSurvivalChartOption = (data: SurvivalData, title: string) => {
  if (
    !data.high ||
    !data.low ||
    data.high.length === 0 ||
    data.low.length === 0
  ) {
    return {};
  }

  // Process high group data
  const highTimes = data.high.map((point) => point[0]);
  const highSurvival = data.high.map((point) => point[1]);

  // Process low group data
  const lowTimes = data.low.map((point) => point[0]);
  const lowSurvival = data.low.map((point) => point[1]);

  return {
    title: {
      text: title,
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        let result = `<div style="font-weight: bold;">${params[0].axisValue} months</div>`;

        params.forEach((param: any) => {
          const seriesName = param.seriesName;
          const value = param.value;
          const color = param.color;

          if (
            seriesName.includes("High") &&
            value &&
            Array.isArray(value) &&
            value.length >= 2
          ) {
            const survivalValue =
              typeof value[1] === "number" ? value[1].toFixed(3) : "N/A";
            result += `<div style="color: ${color}; margin: 5px 0;">
              <span style="font-weight: bold;">High Expression:</span> ${survivalValue}
            </div>`;
          } else if (
            seriesName.includes("Low") &&
            value &&
            Array.isArray(value) &&
            value.length >= 2
          ) {
            const survivalValue =
              typeof value[1] === "number" ? value[1].toFixed(3) : "N/A";
            result += `<div style="color: ${color}; margin: 5px 0;">
              <span style="font-weight: bold;">Low Expression:</span> ${survivalValue}
            </div>`;
          }
        });

        return result;
      },
    },
    legend: {
      data: ["High Expression", "Low Expression"],
      top: 40,
      left: "center",
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Time (months)",
      nameLocation: "middle",
      nameGap: 30,
      min: 0,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#ddd",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Survival Probability",
      nameLocation: "middle",
      nameGap: 40,
      min: 0,
      max: 1,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#ddd",
        },
      },
    },
    series: [
      {
        name: "High Expression",
        type: "line",
        step: "end",
        data: highTimes.map((time, index) => [time, highSurvival[index]]),
        lineStyle: {
          color: "#ff6384",
          width: 2,
        },
        symbol: "circle",
        symbolSize: 4,
        itemStyle: {
          color: "#ff6384",
        },
      },
      {
        name: "Low Expression",
        type: "line",
        step: "end",
        data: lowTimes.map((time, index) => [time, lowSurvival[index]]),
        lineStyle: {
          color: "#36a2eb",
          width: 2,
        },
        symbol: "circle",
        symbolSize: 4,
        itemStyle: {
          color: "#36a2eb",
        },
      },
    ],
  };
};

export const SurvivalChart: React.FC<SurvivalChartProps> = ({
  data,
  title,
  ...props
}) => {
  const option = createSurvivalChartOption(data, title);

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
