import { useEffect, useMemo, useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";

interface StatisticsChartProps {
  stats: {
    labels: string[];
    nannies: number[];
    parents: number[];
  };
}

export default function StatisticsChart({
  stats,
}: StatisticsChartProps) {
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      fp.destroy();
    };
  }, []);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
      },

      colors: ["#465FFF", "#22C55E"],

      chart: {
        fontFamily: "Outfit, sans-serif",
        height: 310,
        type: "area",
        toolbar: {
          show: false,
        },
      },

      stroke: {
        curve: "smooth",
        width: [3, 3],
      },

      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.4,
          opacityTo: 0.05,
        },
      },

      markers: {
        size: 4,
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },

      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },

      dataLabels: {
        enabled: false,
      },

      tooltip: {
        enabled: true,
      },

      xaxis: {
        categories: stats.labels,

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: ["#6B7280"],
            fontSize: "12px",
          },
        },
      },
    }),
    [stats.labels]
  );

  const chartSeries = useMemo(
    () => [
      {
        name: "Nannies",
        data: stats.nannies,
      },
      {
        name: "Parents",
        data: stats.parents,
      },
    ],
    [stats]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics Overview
          </h3>

          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Nannies & Parents analytics overview
          </p>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab />

          <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute left-1/2 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 text-gray-500 pointer-events-none dark:text-gray-400 lg:left-3 lg:translate-x-0" />

            <input
              ref={datePickerRef}
              className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent outline-none dark:border-gray-700 dark:bg-gray-800 lg:h-auto lg:w-40 lg:py-2 lg:pl-10 lg:pr-3 lg:text-gray-700 dark:lg:text-gray-300"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}