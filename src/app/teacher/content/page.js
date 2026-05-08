"use client";

import React, { useEffect, useState } from 'react';
import { getMyContent } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Video, 
  Plus, 
  Filter,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function MyContentPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teacher/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Content</h1>
            <p className="text-sm text-muted-foreground">View and manage all your broadcast requests.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" asChild>
            <Link href="/teacher/upload">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="w-[300px]">Broadcast Details</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : content.length > 0 ? (
                content.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{item.title}</span>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        {item.status === 'rejected' && item.rejectionReason && (
                          <div className="mt-2 flex items-start gap-1.5 text-[10px] text-rose-600 bg-rose-50 dark:bg-rose-950/30 p-1.5 rounded border border-rose-100 dark:border-rose-900">
                            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                            <span><strong>Reason:</strong> {item.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                        {item.subject || "Mathematics"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Starts: {item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Ends: {item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === 'approved' && (
                          <Button variant="outline" size="xs" className="h-8 px-2 text-[10px] uppercase font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                            <Video className="mr-1.5 h-3 w-3" />
                            Go Live
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
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <Video className="h-12 w-12 opacity-10" />
                      <p>No content found. Start broadcasting today!</p>
                      <Button variant="link" asChild>
                        <Link href="/teacher/upload">Submit your first request</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info card for Rejection handling */}
      {!loading && content.some(c => c.status === 'rejected') && (
        <Card className="bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50">
          <CardContent className="p-4 flex gap-4">
            <div className="bg-rose-100 dark:bg-rose-900/50 p-2 rounded-full h-fit">
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-rose-900 dark:text-rose-300">Handling Rejected Content</p>
              <p className="text-rose-700/80 dark:text-rose-400/80 mt-1">
                If your request was rejected, please check the reason provided. You can edit and resubmit your request or create a new one following the principal's feedback.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
