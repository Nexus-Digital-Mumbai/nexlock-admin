import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Store, Smartphone, Lock, Unlock, Plus, ArrowUpRight, ShieldOff } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { StatusBadge } from "@/components/nexlock/StatusBadge";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — NexLock Admin" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["bi", "summary"],
    queryFn: () => apiClient.get("/bi/summary"),
  });

  const summary = data?.data || {
    totalDealers: 0,
    totalDevicesEnrolled: 0,
    devicesLocked: 0,
    devicesUnlocked: 0,
    devicesReleased: 0,
    recentEnrollments: [] as any[],
  };

  return (
    <div>
      <PageHeader
        title="Operations Dashboard"
        description="Dealers onboarded, devices enrolled, and lock status at a glance."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Dashboard" }]}
      />

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center text-sm text-muted-foreground">Loading dashboard data…</div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Link to="/dealers" className="block">
              <KpiCard label="Total Dealers" value={String(summary.totalDealers)} sub="onboarded" icon={Store} />
            </Link>
            <Link to="/devices" className="block">
              <KpiCard label="Devices Enrolled" value={String(summary.totalDevicesEnrolled)} sub="total active" icon={Smartphone} />
            </Link>
            <Link to="/devices" className="block">
              <KpiCard label="Locked" value={String(summary.devicesLocked)} sub="EMI hold active" icon={Lock} tone="warning" />
            </Link>
            <Link to="/devices" className="block">
              <KpiCard label="Unlocked" value={String(summary.devicesUnlocked)} sub="in customer use" icon={Unlock} tone="success" />
            </Link>
            <Link to="/devices" className="block">
              <KpiCard label="Released" value={String(summary.devicesReleased)} sub="EMI completed" icon={ShieldOff} />
            </Link>
          </div>

          {/* Quick actions */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                { label: "Onboard Dealer", icon: Plus, to: "/dealers" },
                { label: "View Devices", icon: Smartphone, to: "/devices" },
                { label: "View Customers", icon: Store, to: "/customers" },
              ].map((a) => (
                <Link key={a.label} to={a.to as never} className="card-surface group flex items-center gap-3 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <a.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-sm font-medium">{a.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent enrollments */}
          <div className="mt-6">
            <div className="card-surface">
              <div className="border-b border-border p-4">
                <h3 className="text-sm font-semibold">Latest Device Enrollments</h3>
              </div>
              <ul className="divide-y divide-border">
                {summary.recentEnrollments.map((d: any) => (
                  <li key={d.deviceId} className="flex items-center gap-3 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground shrink-0">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{d.deviceCode} • {d.customer?.name ?? "Unknown customer"}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {d.customer?.phone ?? "—"} • {d.dealerName ?? "—"}
                      </div>
                    </div>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
                {summary.recentEnrollments.length === 0 && (
                  <li className="p-4 text-center text-xs text-muted-foreground">No devices enrolled yet</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
