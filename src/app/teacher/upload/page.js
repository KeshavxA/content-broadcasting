"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { upload } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

const uploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description is too long'),
});

export default function UploadContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await upload(data);
      // Redirect back to dashboard on success
      router.push('/teacher/dashboard');
    } catch (error) {
      console.error("Failed to upload content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/teacher/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">New Broadcast Request</CardTitle>
            <CardDescription>
              Submit your content for principal approval before going live.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Broadcast Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Introduction to Quantum Physics"
                  {...register('title')}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Session Description</Label>
                <Textarea
                  id="description"
                  placeholder="What will you be teaching in this session?"
                  rows={5}
                  {...register('description')}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-xs font-medium text-destructive">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t mt-4">
              <Button variant="outline" type="button" asChild disabled={isLoading}>
                <Link href="/teacher/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex gap-4">
            <div className="bg-primary/10 p-2 rounded-full h-fit mt-1">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-primary">Approval Process</p>
              <p className="text-muted-foreground mt-1">
                Your request will be sent to the school principal. Once approved, you'll see a "Go Live" button on your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
