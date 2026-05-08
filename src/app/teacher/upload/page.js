"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { upload } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Send, Upload, X, CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "History", 
  "Geography", "English", "Computer Science", "Arts", "Physical Education"
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const uploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description is too long'),
  rotationDuration: z.coerce.number().min(5, 'Minimum 5 seconds').max(3600, 'Maximum 1 hour'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  file: z.any()
    .refine((files) => files?.length === 1, "Image is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .gif formats are supported."
    ),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  return new Date(data.endTime) > new Date(data.startTime);
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export default function UploadContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      rotationDuration: 10,
      startTime: '',
      endTime: '',
    },
  });

  const fileWatcher = watch("file");

  useEffect(() => {
    if (fileWatcher && fileWatcher.length > 0) {
      const file = fileWatcher[0];
      if (ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [fileWatcher]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // In a real app, we would use FormData to upload the file
      await upload({
        ...data,
        fileName: data.file[0].name,
        fileSize: data.file[0].size,
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/teacher/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Failed to upload content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl text-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/30 p-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your broadcast request has been sent to the principal for approval.
          </p>
          <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-progress origin-left"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild size="sm">
            <Link href="/teacher/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="text-xs font-medium text-muted-foreground bg-white dark:bg-slate-900 px-3 py-1 rounded-full border">
            Phase 4: Teacher Content Management
          </div>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardHeader>
            <CardTitle className="text-2xl font-bold">New Broadcast Request</CardTitle>
            <CardDescription>
              Provide the details for your educational broadcast session.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                  <Library className="h-4 w-4" />
                  <span>General Information</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Broadcast Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Advanced Calculus Intro"
                      {...register('title')}
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      id="subject"
                      {...register('subject')}
                      className={errors.subject ? 'border-destructive' : ''}
                    >
                      <option value="">Select a subject</option>
                      {SUBJECTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                    {errors.subject && (
                      <p className="text-xs font-medium text-destructive">{errors.subject.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Session Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a brief overview of what will be taught..."
                    rows={3}
                    {...register('description')}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <p className="text-xs font-medium text-destructive">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Section 2: Media */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                  <Upload className="h-4 w-4" />
                  <span>Broadcast Media</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 items-start">
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload Presentation Image</Label>
                    <div 
                      className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all cursor-pointer group ${
                        errors.file ? 'border-destructive bg-destructive/5' : 'border-slate-300 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <input
                        id="file"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register('file')}
                      />
                      <div className="flex flex-col items-center text-center p-4">
                        <Upload className={`h-8 w-8 mb-2 ${errors.file ? 'text-destructive' : 'text-slate-400 group-hover:text-primary'}`} />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF (max. 10MB)</p>
                      </div>
                    </div>
                    {errors.file && (
                      <p className="text-xs font-medium text-destructive">{errors.file.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Image Preview</Label>
                    <div className="w-full h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 text-xs">
                          <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                          <span>No image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Scheduling */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                  <Calendar className="h-4 w-4" />
                  <span>Broadcast Schedule</span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Date & Time</Label>
                    <div className="relative">
                      <Input
                        id="startTime"
                        type="datetime-local"
                        {...register('startTime')}
                        className={errors.startTime ? 'border-destructive' : ''}
                      />
                    </div>
                    {errors.startTime && (
                      <p className="text-xs font-medium text-destructive">{errors.startTime.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Date & Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      {...register('endTime')}
                      className={errors.endTime ? 'border-destructive' : ''}
                    />
                    {errors.endTime && (
                      <p className="text-xs font-medium text-destructive">{errors.endTime.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rotationDuration">Rotation (Seconds)</Label>
                    <div className="relative">
                      <Clock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="rotationDuration"
                        type="number"
                        {...register('rotationDuration')}
                        className={errors.rotationDuration ? 'border-destructive' : ''}
                      />
                    </div>
                    {errors.rotationDuration && (
                      <p className="text-xs font-medium text-destructive">{errors.rotationDuration.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t bg-slate-50/50 dark:bg-slate-900/50">
              <Button variant="ghost" type="button" asChild disabled={isLoading}>
                <Link href="/teacher/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-w-[140px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
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
      </div>
    </div>
  );
}
