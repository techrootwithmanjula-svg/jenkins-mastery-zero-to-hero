export interface MetricItem {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface EcommerceMetricsProps {
  metrics: MetricItem[];
}

export default function EcommerceMetrics({
  metrics,
}: EcommerceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          onClick={metric.onClick}
          className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-4"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {metric.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>

              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}