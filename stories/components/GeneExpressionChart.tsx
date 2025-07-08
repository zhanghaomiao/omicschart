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

interface GeneExpressionData {
  [dataset: string]: {
    [group: string]: (number | null | undefined)[];
  };
}

interface GeneExpressionChartProps {
  data: GeneExpressionData;
  title?: string;
  geneName?: string;
}

const getScatterOption = (data: GeneExpressionData, title?: string, geneName?: string) => {
  const space = 10;
  let acc_cnt = -10;
  let groupSet = new Set<string>();
  let dataset_cnt = 0;
  
  const series = Object.entries(data).flatMap(([_, groups]) => {
    if (Object.keys(groups).length === 0) return [];
    dataset_cnt++;
    return Object.entries(groups).map(([group, values]) => {
      groupSet.add(group);
      acc_cnt += space;
      let markArea = {};
      if (dataset_cnt % 2 === 0) {
        markArea = {
          silent: true,
          itemStyle: {
            color: '#f5f5f5',
            opacity: 0.5
          },
          data: [[
            { yAxis: acc_cnt },
            { yAxis: acc_cnt + space }
          ]]
        };
      }
      return {
        name: `${group}`,
        type: 'scatter',
        data: values
          .filter((value): value is number => value !== null && value !== undefined && !isNaN(value))
          .map((value, index) => [value.toFixed(2), acc_cnt + space / values.length * index]),
        symbolSize: 5,
        markArea: markArea
      };
    });
  });

  return {
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
    grid: {
      left: 10,
      right: 10,
      bottom: 40,
      top: title ? 40 : 0,
      containLabel: false
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        // Return group name and expression value
        const group = params.seriesName || '';
        const value = params.value?.[0] || '';
        return `${group}<br/>Expression: ${value}`;
      }
    },
    xAxis: {
      name: 'Scaled expression',
      nameLocation: 'middle',
      nameTextStyle: {
        color: "#999999",
        fontSize: 14
      },
      type: 'value',
      min: function (value: { min: number }) {
        return Math.floor(value.min)
      },
      max: function (value: { max: number }) {
        return Math.ceil(value.max)
      },
      axisLine: {
        lineStyle: {
          color: "#DBD6F6"
        }
      },
      splitLine: {
        lineStyle: {
          color: "#DBD6F6"
        }
      },
      axisLabel: {
        inside: true,
        color: "#222222"
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      inverse: true,
      type: 'value',
      min: 0,
      max: 'dataMax',
      axisLine: {
        lineStyle: {
          color: "#DBD6F6"
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    color: [
      "#CF4343",
      "#4B4691",
      "#46916E",
      "#91466E",
      "#579146"
    ],
    legend: {
      show: false,
      data: Array.from(groupSet).map((group) => ({
        name: group,
        icon: 'circle',
      }))
    },
    series: series
  };
};

export const GeneExpressionChart: React.FC<GeneExpressionChartProps> = ({
  data,
  title,
  geneName,
}) => {
  const option = getScatterOption(data, title, geneName);

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