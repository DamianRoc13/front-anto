"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function AnalistChart({
  employeeName,
  chartData,
}: {
  employeeName: string;
  chartData: { month: string; calificacionKPI: number; totalKPI: number }[];
}) {
  const chartConfig = {
    calificacionKPI: {
      label: "Calificación KPI",
      color: "hsl(var(--chart-1))",
    },
    totalKPI: {
      label: "Pago KPI",
      color: "hsl(var(--chart-5))",
    },
  };

  const processedChartData = chartData.map((data) => ({
    ...data,
    calificacionKPI: Math.round(data.calificacionKPI),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso de {employeeName}</CardTitle>
        <CardDescription>
          Análisis del progreso en los historiales de KPI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={processedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
            height={0} 
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillCalificacionKPI" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTotalKPI" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="calificacionKPI"
              type="natural"
              fill="url(#fillCalificacionKPI)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="totalKPI"
              type="natural"
              fill="url(#fillTotalKPI)"
              fillOpacity={0.4}
              stroke="var(--chart-5)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Análisis completado <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AnalistChart;
