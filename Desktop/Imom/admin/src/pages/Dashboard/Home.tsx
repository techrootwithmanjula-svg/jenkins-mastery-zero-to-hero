import { useCallback, useEffect, useMemo, useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import { getStatsService } from "../../services/authService";
import { showAlert } from "../../services/alertService";
import { GroupIcon, CheckCircleIcon, EyeCloseIcon, UserCircleIcon } from "../../icons";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import { formatErrorMessage } from "../../utils/errors";
import type { MetricItem, StatsResponse } from "../../types/entities";

export default function Home() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getStatsService();

      if (result?.status !== "success") {
        throw new Error(result?.message || "Failed to fetch stats");
      }

      setStats(result.data);
    } catch (error) {
      showAlert("error", formatErrorMessage(error, "Failed to fetch stats"), "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /**
   * Icons are stable JSX — defined as constants outside useMemo so they don't
   * change on every render and invalidate the metrics memoisation.
   */
  const iconClassName = "size-6 text-gray-800 dark:text-white/90";

  const totalNanniesIcon = <GroupIcon className={iconClassName} />;
  const activeNanniesIcon = <CheckCircleIcon className={iconClassName} />;
  const inactiveNanniesIcon = (
    <EyeCloseIcon className="size-6 text-error-500 dark:text-error-400" />
  );
  const totalParentsIcon = <UserCircleIcon className={iconClassName} />;

  const metrics: MetricItem[] = useMemo(() => {
    if (!stats) return [];

    const { nannies, parents } = stats;

    return [
      {
        title: "Total Nannies",
        value: String(nannies.total),
        change: "+10%",
        isUp: true,
        icon: totalNanniesIcon,
      },
      {
        title: "Active Nannies",
        value: String(nannies.active),
        change: "+5%",
        isUp: true,
        icon: activeNanniesIcon,
      },
      {
        title: "Inactive Nannies",
        value: String(nannies.inactive),
        change: "-2%",
        isUp: false,
        icon: inactiveNanniesIcon,
      },
      {
        title: "Total Parents",
        value: String(parents.total),
        change: "+12%",
        isUp: true,
        icon: totalParentsIcon,
      },
    ];
    // Icons are stable JSX constants — intentionally omitted from deps to
    // prevent useMemo from re-running on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  return (
    <>
      <PageMeta title="Dashboard" description="Admin dashboard statistics" />

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-500">
            Loading stats...
          </div>
        ) : (
          <>
            <EcommerceMetrics metrics={metrics} />
            <DemographicCard stats={stats} />
          </>
        )}
      </div>
    </>
  );
}
