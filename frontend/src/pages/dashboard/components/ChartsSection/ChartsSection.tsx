import PlansChart from "./PlansChart";
import RevenueChart from "./RevenueChart";
import UserDistribution from "./UserDistribution";

export default function ChartsSection() {
  return (
    <div className="grid w-full grid-cols-3 gap-6">
      <div className="rounded-sm border border-gray-200/50 bg-white p-6">
        <RevenueChart />
      </div>
      <div className="rounded-sm border border-gray-200/50 bg-white p-6">
        <PlansChart />
      </div>
      <div className="rounded-sm border border-gray-200/50 bg-white p-6">
        <UserDistribution />
      </div>
    </div>
  );
}
