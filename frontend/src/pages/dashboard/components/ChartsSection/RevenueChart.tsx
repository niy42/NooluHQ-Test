import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { revenueChartData } from "../../contants";

export default function RevenueChart() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex w-full items-center justify-between">
          <p className="text-sm text-gray-500">Revenue over time</p>
          <span className="text-xs font-medium text-blue-500">THIS MONTH</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueChartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
