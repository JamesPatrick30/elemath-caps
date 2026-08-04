import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import PixelPanel from "../common/PixelPanel";
import type { TrendPoint } from "../../types";

interface PerformanceChartProps {
  data: TrendPoint[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <PixelPanel accent="sky" title="Average Score Trend">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#294634" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              stroke="#a89b74"
              tick={{ fontFamily: "JetBrains Mono", fontSize: 11 }}
            />
            <YAxis
              stroke="#a89b74"
              tick={{ fontFamily: "JetBrains Mono", fontSize: 11 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "#1f3626",
                border: "2px solid #4a3423",
                fontFamily: "JetBrains Mono",
                fontSize: 12,
                color: "#f3ecd2",
              }}
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              stroke="#7ecbe8"
              strokeWidth={2}
              dot={{ fill: "#7ecbe8", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </PixelPanel>
  );
}