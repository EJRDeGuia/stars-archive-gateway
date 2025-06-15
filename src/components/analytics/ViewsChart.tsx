
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface ViewsChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  legend?: string;
  color?: string;
}

const ViewsChart: React.FC<ViewsChartProps> = ({
  title,
  data,
  legend = "Views",
  color = "#059669",
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="w-full h-64">
          <ChartContainer
            config={{
              views: {
                label: legend,
                color
              }
            }}
          >
            <BarChart data={data}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Bar dataKey="value" name={legend} fill={color} radius={[6, 6, 0, 0]} />
              <ChartTooltip />
              <ChartLegendContent />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewsChart;
