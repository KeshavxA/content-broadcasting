"use client";

import React, { useEffect, useState } from 'react';
import { getPending, approve, reject } from '@/services/approval.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  User, 
  AlertCircle,
  Video,
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function PendingApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  // Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [rejectError, setRejectError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getPending();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
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
      // Update local state by removing the approved item
      setRequests(prev => prev.filter(req => req.id !== id));
      // In a real app, you'd show a toast here
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (id) => {
    setSelectedId(id);
    setRejectReason('');
    setRejectError('');
    setIsRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setRejectError('A reason is required for rejection.');
      return;
    }

    setProcessingId(selectedId);
    try {
      await reject(selectedId, rejectReason);
      setRequests(prev => prev.filter(req => req.id !== selectedId));
      setIsRejectModalOpen(false);
    } catch (error) {
      console.error("Rejection failed:", error);
    } finally {
      setProcessingId(null);
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/principal/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">Review and moderate broadcast requests from teachers.</p>
        </div>
      </div>

      {/* Main List */}
      <div className="grid gap-6">
        {loading ? (
          [1, 2].map(i => (
            <Card key={i} className="animate-pulse h-48 border-none bg-white dark:bg-slate-900" />
          ))
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <Card key={request.id} className="border-none shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Preview Placeholder */}
              <div className="w-full md:w-64 h-48 md:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-r">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Video className="h-10 w-10 opacity-20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Media Preview</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="warning" className="h-5">Pending Review</Badge>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase">{request.id}</span>
                      </div>
                      <CardTitle className="text-xl">{request.title}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <User className="h-3 w-3" />
                        <span>{request.teacherName}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Requested: {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 italic">
                    "{request.description}"
                  </p>
                </CardContent>
                <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 py-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => openRejectModal(request.id)}
                    disabled={!!processingId}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleApprove(request.id)}
                    disabled={!!processingId}
                  >
                    {processingId === request.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Approve Broadcast
                      </>
                    )}
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-none shadow-sm h-64 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-full mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle>All Caught Up!</CardTitle>
            <CardDescription>
              There are no pending broadcast requests to review at this time.
            </CardDescription>
            <Button variant="link" asChild className="mt-2">
              <Link href="/principal/dashboard">Back to Dashboard</Link>
            </Button>
          </Card>
        )}
      </div>

      {/* Rejection Modal */}
      <Dialog isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
        <DialogHeader onClose={() => setIsRejectModalOpen(false)}>
          <DialogTitle>Reject Broadcast Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this request. This will be shared with the teacher.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Rejection Reason</label>
                <span className="text-[10px] text-rose-500 font-bold uppercase">Mandatory</span>
              </div>
              <Textarea 
                placeholder="e.g. Content does not meet school guidelines. Please revise the description..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className={rejectError ? 'border-rose-500 ring-rose-500/20' : ''}
              />
              {rejectError && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {rejectError}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)} disabled={!!processingId}>
            Cancel
          </Button>
          <Button 
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleReject}
            disabled={!!processingId}
          >
            {processingId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Confirm Rejection'
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
