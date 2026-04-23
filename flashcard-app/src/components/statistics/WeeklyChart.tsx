"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart";
import { WeeklyData } from "@/src/hooks/useStatistics";

const chartConfig = {
  cards: {
    label: "Thẻ đã học",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface WeeklyChartProps {
  weeklyData: WeeklyData[];
  maxCards: number;
}

export const WeeklyChart = ({ weeklyData }: WeeklyChartProps) => {
  return (
    <Card className="shadow-sm border-gray-100 mb-8 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          Biểu đồ hoạt động
        </CardTitle>
        <CardDescription className="text-gray-500">
          Hiệu suất học tập trong 7 ngày qua
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={weeklyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={{ fill: "transparent" }}
              content={<ChartTooltipContent hideLabel indicator="dot" />}
            />
            <Bar
              dataKey="cards"
              fill="var(--color-cards)"
              radius={[8, 8, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
