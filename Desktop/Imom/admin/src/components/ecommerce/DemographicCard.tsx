import {
  CheckCircleIcon,
  EyeCloseIcon,
  UserCircleIcon,
} from "../../icons";

interface Props {
  stats: {
    nannies: {
      total: number;
      active: number;
      inactive: number;
    };
    parents: {
      total: number;
    };
  } | null;
}

const iconClassName = "size-5 text-brand-500 dark:text-brand-400";

export default function DemographicCard({ stats }: Props) {
  if (!stats) return null;

  const { nannies, parents } = stats;

  const items = [
    {
      label: "Active Nannies",
      value: nannies.active,
      percent: Math.round((nannies.active / nannies.total) * 100) || 0,
      icon: <CheckCircleIcon className="size-5 text-success-500 dark:text-success-400" />,
      iconBgClass: "bg-success-50 dark:bg-success-500/10",
    },
    {
      label: "Inactive Nannies",
      value: nannies.inactive,
      percent: Math.round((nannies.inactive / nannies.total) * 100) || 0,
      icon: <EyeCloseIcon className="size-5 text-error-500 dark:text-error-400" />,
      iconBgClass: "bg-error-50 dark:bg-error-500/10",
    },
    {
      label: "Total Parents",
      value: parents.total,
      percent: 100,
      icon: <UserCircleIcon className={iconClassName} />,
      iconBgClass: "bg-brand-50 dark:bg-brand-500/10",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Platform Demographics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Nannies & Parents distribution
          </p>
        </div>
      </div>

      {/* Dynamic Stats */}
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconBgClass}`}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white/90">
                  {item.label}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {item.value} Users
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className="absolute left-0 top-0 h-full rounded-sm bg-brand-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>

              <p className="font-medium text-gray-800 dark:text-white/90">
                {item.percent}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
