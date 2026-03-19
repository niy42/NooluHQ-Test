export default function UserDistribution() {
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">User distribution by country</p>

      <div className="flex h-40 items-center justify-center text-gray-400">
        Donut chart
      </div>

      <div className="mt-4 space-y-1 text-xs">
        <p>Nigeria (40%)</p>
        <p>US (30%)</p>
        <p>UK (20%)</p>
        <p>Others (10%)</p>
      </div>
    </div>
  );
}
