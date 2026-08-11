import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TrendPoint } from "../../types";
import PixelPanel from "../common/PixelPanel";

interface PerformanceChartProps {
  data: TrendPoint[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <PixelPanel accent="sky">
      <p className="font-pixel text-[10px] text-parchment-500 uppercase mb-4">Class average trend</p>

      {data.length === 0 ? (
        <p className="font-body text-sm text-parchment-300">No quiz attempts yet.</p>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#2a4a33" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#8fae8f" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8fae8f" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#16351f", border: "2px solid #6fcf67", fontSize: 12 }}
                labelStyle={{ color: "#f2c14e" }}
              />
              <Line
                type="monotone"
                dataKey="averageScore"
                stroke="#6fcf67"
                strokeWidth={3}
                dot={{ r: 3, fill: "#6fcf67" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </PixelPanel>
  );
}