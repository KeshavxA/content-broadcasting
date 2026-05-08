"use client";

import React, { useEffect, useState } from 'react';
import { getPending, approve, reject } from '@/services/approval.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Check,
  X,
  User,
  Video,
  Loader2,
} from 'lucide-react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function PendingApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getPending();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
      toast.error("Failed to load approval requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await approve(id);
      setRequests(prev => prev.filter(req => req.id !== id));
      toast.success("Broadcast request approved successfully!");
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve request.");
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (id) => {
    setSelectedId(id);
    setIsRejectModalOpen(true);
  };

  const handleReject = async (reason) => {
    setProcessingId(selectedId);
    try {
      await reject(selectedId, reason);
      setRequests(prev => prev.filter(req => req.id !== selectedId));
      setIsRejectModalOpen(false);
      toast.info("Broadcast request has been rejected.");
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error("Failed to reject request.");
    } finally {
      setProcessingId(null);
      setSelectedId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">Review and moderate broadcast requests from teachers.</p>
        </div>

        <div className="grid gap-6">
          {loading ? (
            [1, 2].map(i => (
              <Card key={i} className="border-none bg-white dark:bg-slate-900 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="w-full md:w-64 h-48 md:h-auto" />
                  <div className="flex-1 p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </Card>
            ))
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <Card key={request.id} className="border-none shadow-sm overflow-hidden flex flex-col md:flex-row group">

                <div className="w-full md:w-64 h-48 md:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-r relative overflow-hidden">
                  <Video className="h-12 w-12 text-slate-300 opacity-50 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status="pending" />
                          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">{request.id}</span>
                        </div>
                        <CardTitle className="text-xl font-bold">{request.title}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">
                          <User className="h-3 w-3" />
                          <span>{request.teacherName}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-800 pl-4">
                      "{request.description}"
                    </p>
                  </CardContent>
                  <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 py-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => openRejectModal(request.id)}
                      disabled={!!processingId}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                      onClick={() => handleApprove(request.id)}
                      disabled={!!processingId}
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Approve Session
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Check}
              title="All caught up!"
              message="There are no pending broadcast requests waiting for your review."
              actionLabel="Return to Dashboard"
              actionHref="/principal/dashboard"
            />
          )}
        </div>

        <ConfirmModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={handleReject}
          title="Reject Request"
          description="Please provide a mandatory reason for rejecting this broadcast. The teacher will be notified immediately."
          confirmLabel="Reject Broadcast"
          confirmVariant="destructive"
          requireReason={true}
          isLoading={!!processingId}
        />
      </div>
    </DashboardLayout>
  );
}
