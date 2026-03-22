import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { COLORS, userDistributionData } from "../../contants";

export default function UserDistribution() {
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">User distribution by country</p>

      <div className="h-40">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={userDistributionData}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {userDistributionData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        {userDistributionData.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: COLORS[i] }}
              />
              {item.name}
            </span>
            <span>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
