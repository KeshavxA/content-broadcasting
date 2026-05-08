"use client";

import React, { useEffect, useState } from 'react';
import { getMyContent } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Calendar, 
  AlertCircle, 
  Video, 
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/shared/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function MyContentPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyContent();
        setContent(data || []);
      } catch (error) {
        console.error("Failed to fetch content:", error);
        toast.error("Failed to load your content history.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Content</h1>
            <p className="text-sm text-muted-foreground">View and manage all your broadcast requests.</p>
          </div>
          <Button size="sm" asChild>
            <Link href="/teacher/upload">
              Upload New Content
            </Link>
          </Button>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-[300px]">Broadcast Details</TableHead>
                  <TableHead className="hidden md:table-cell">Subject</TableHead>
                  <TableHead className="hidden lg:table-cell">Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-12 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : content?.length > 0 ? (
                  content.map((item) => (
                    <TableRow key={item?.id} className="group">
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{item?.title}</span>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item?.description}</p>
                          {item?.status === 'rejected' && item?.rejectionReason && (
                            <div className="mt-2 flex items-start gap-1.5 text-[10px] text-rose-600 bg-rose-50 dark:bg-rose-950/30 p-1.5 rounded border border-rose-100 dark:border-rose-900">
                              <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                              <span><strong>Reason:</strong> {item.rejectionReason}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                          {item?.subject || "Mathematics"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{item?.startTime ? new Date(item.startTime).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item?.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {item?.status === 'approved' && (
                            <Button variant="outline" size="sm" className="h-8 px-2 text-[10px] font-bold text-emerald-600 border-emerald-200" asChild>
                               <Link href={`/live/${item?.teacherId}`}>
                                 View Live
                               </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <EmptyState 
                        title="No requests found"
                        message="Start broadcasting by creating your first content request."
                        actionLabel="Create Request"
                        actionHref="/teacher/upload"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
