"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getActiveByTeacher } from '@/services/content.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  Wifi,
  User,
  Library,
  Clock,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PublicLivePage() {
  const { teacherId } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchLiveContent = useCallback(async (isAutoPoll = false) => {
    if (!isAutoPoll) setLoading(true);
    try {
      const data = await getActiveByTeacher(teacherId);
      setContent(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch live content:", err);
      setError("Unable to load live stream info.");
    } finally {
      if (!isAutoPoll) setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchLiveContent();

    const interval = setInterval(() => {
      fetchLiveContent(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchLiveContent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-slate-800 rounded mx-auto" />
          <div className="aspect-video w-full bg-slate-800 rounded-2xl" />
          <div className="h-24 w-full bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30">

      <header className="p-4 md:p-6 border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center bg-slate-950/80">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <Video className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl hidden sm:inline-block">Broadcast <span className="text-primary">Live</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase tracking-widest">
            <RefreshCcw className="h-3 w-3 animate-spin-slow" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        {!content ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-slate-500/20 blur-3xl rounded-full" />
              <Video className="h-24 w-24 text-slate-700 relative z-10 opacity-50" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">No Content Available</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Teacher {teacherId} is not currently broadcasting any live content. Please check back later.
              </p>
            </div>
            <Button variant="outline" onClick={() => fetchLiveContent()} className="border-slate-800">
              Refresh Status
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-rose-600 hover:bg-rose-600 text-white px-3 py-1 animate-pulse">
                  <Wifi className="h-3 w-3 mr-1.5" />
                  LIVE
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-800">
                  {content.subject || "Academic Session"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <User className="h-4 w-4" />
                <span className="font-medium text-slate-200">{content.teacherName}</span>
              </div>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 group">

              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${content.id}`}
                  alt="Broadcast background"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl"
                />
                <div className="relative z-10 text-center space-y-4 p-8">
                  <div className="bg-slate-950/50 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-inner">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">{content.title}</h1>
                    <p className="text-slate-400 text-lg">{content.description}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                  <Library className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Current Session</p>
                  <p className="text-sm font-medium">{content.subject}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-900 border-slate-800 text-white md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Broadcast Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">
                    {content.description || "No additional description provided for this session."}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Session Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Started At</p>
                    <p className="text-sm">{new Date(content.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Teacher ID</p>
                    <p className="text-sm font-mono">{teacherId}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-rose-500 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                    Live Transmission Active
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-12 border-t border-slate-800 text-center">
        <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
          <AlertCircle className="h-4 w-4 opacity-50" />
          <p>This is a live educational broadcast page. Stay respectful and focused.</p>
          <p className="mt-4">© 2024 Content Broadcasting System</p>
        </div>
      </footer>
    </div>
  );
}
