import StatCard from "./StatCard";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <StatCard
        title="Total Revenue"
        value="₦24,000.00"
        change="+20%"
        positive
      />
      <StatCard title="Churned Revenue" value="₦2,000.00" change="-5%" />
      <StatCard title="Active Users" value="400" change="+20%" positive />
    </div>
  );
}
