"use client";

import React, { useEffect, useState } from 'react';
import { getMyContent } from "@/services/content.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Plus,
  ChevronRight,
  Video
} from "lucide-react";
import Link from 'next/link';
import DashboardLayout from '@/components/shared/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const content = await getMyContent();
        const newStats = content.reduce((acc, curr) => {
          acc.total++;
          acc[curr.status]++;
          return acc;
        }, { total: 0, pending: 0, approved: 0, rejected: 0 });

        setStats(newStats);
        setRecentContent(content.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Total Requests", value: stats.total, status: "all", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { title: "Pending Review", value: stats.pending, status: "pending", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { title: "Approved Sessions", value: stats.approved, status: "approved", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { title: "Rejected Sessions", value: stats.rejected, status: "rejected", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" }
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Manage your broadcast requests and live sessions.</p>
          </div>
          <Button asChild>
            <Link href="/teacher/upload">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {loading ? <Skeleton className="h-8 w-12" /> : stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <StatusBadge status={stat.status === 'all' ? 'pending' : stat.status} className="hidden" />

                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Your latest broadcast submissions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-primary">
                <Link href="/teacher/content">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : recentContent.length > 0 ? (
                <div className="space-y-4">
                  {recentContent.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800">
                          <Video className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Requested {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={item.status} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No requests yet"
                  message="Submit your first broadcast request to get started."
                  actionLabel="New Request"
                  actionHref="/teacher/upload"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
