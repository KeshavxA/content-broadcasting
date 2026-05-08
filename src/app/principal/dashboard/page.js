"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { getAll } from "@/services/content.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LogOut, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  LayoutGrid,
  Bell,
  ArrowRight
} from "lucide-react";
import Link from 'next/link';

export default function PrincipalDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allContent = await getAll();
        const newStats = allContent.reduce((acc, curr) => {
          acc.total++;
          acc[curr.status]++;
          return acc;
        }, { total: 0, pending: 0, approved: 0, rejected: 0 });
        
        setStats(newStats);
      } catch (error) {
        console.error("Failed to fetch principal stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: "All Requests", 
      value: stats.total, 
      icon: LayoutGrid, 
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30"
    },
    { 
      title: "Awaiting Review", 
      value: stats.pending, 
      icon: Clock, 
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30"
    },
    { 
      title: "Approved Sessions", 
      value: stats.approved, 
      icon: CheckCircle2, 
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30"
    },
    { 
      title: "Rejected Sessions", 
      value: stats.rejected, 
      icon: XCircle, 
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2.5 rounded-xl">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Principal Dashboard</h1>
            <p className="text-muted-foreground">Oversee and manage school-wide broadcast approvals.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {stats.pending > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white">
                {stats.pending}
              </span>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{loading ? "..." : stat.value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm overflow-hidden bg-primary text-primary-foreground group">
          <CardHeader>
            <CardTitle className="text-xl">Pending Approvals</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              You have {stats.pending} broadcast requests waiting for your review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full sm:w-auto" asChild>
              <Link href="/principal/approvals">
                Go to Approvals
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="h-14 w-14 rounded-full ring-2 ring-primary/20"
            />
            <div>
              <p className="font-bold text-lg">{user?.name}</p>
              <p className="text-sm text-muted-foreground">Principal, {user?.school || "Greenwood High"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
