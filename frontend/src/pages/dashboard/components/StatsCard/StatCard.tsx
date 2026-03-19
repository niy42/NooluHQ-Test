import classNames from "classnames";

export default function StatCard({
  title,
  value,
  change,
  positive,
}: {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="flex h-36 flex-col items-start justify-between rounded-sm border border-gray-200/50 bg-white p-5">
      <p className="text-xs text-gray-500 uppercase">{title}</p>

      <div className="mt-2 flex items-center gap-4">
        <h2 className="text-xl font-semibold">{value}</h2>

        <span
          className={classNames("text-sm", {
            "text-green-500": positive,
            "text-red-500": !positive,
          })}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
