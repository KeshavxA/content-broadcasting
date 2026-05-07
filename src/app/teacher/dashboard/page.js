"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { getMyContent } from "@/services/content.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Library,
  Video,
  ChevronRight
} from "lucide-react";
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
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
    {
      title: "Total Requests",
      value: stats.total,
      icon: Library,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30"
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your broadcast requests and live sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/teacher/upload">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
          <Button variant="outline" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{loading ? "..." : stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Your latest broadcast submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : recentContent.length > 0 ? (
              <div className="space-y-4">
                {recentContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${item.isLive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                        <Video className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                        item.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                          'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        }`}>
                        {item.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No requests found. Start by creating a new one.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Profile Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="h-16 w-16 rounded-full border-2 border-primary/20"
              />
              <div>
                <p className="font-bold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span className="capitalize font-medium">{user?.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">School</span>
                <span className="font-medium">{user?.school || "Greenwood High"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dept</span>
                <span className="font-medium">{user?.department || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
