export default function RevenueChart() {
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <p className="text-sm text-gray-500">Revenue over time</p>
        <span className="text-xs text-blue-500">THIS MONTH</span>
      </div>

      <div className="flex h-48 items-center justify-center text-gray-400">
        Chart goes here
      </div>
    </div>
  );
}
