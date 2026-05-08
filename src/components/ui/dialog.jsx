import * as React from "react"
import { cn } from "@/utils/utils"
import { X } from "lucide-react"

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}

const DialogHeader = ({ className, children, onClose, ...props }) => (
  <div className={cn("flex items-center justify-between p-6 border-b", className)} {...props}>
    <div className="flex flex-col space-y-1.5 text-left">
      {children}
    </div>
    {onClose && (
      <button 
        onClick={onClose}
        className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="h-5 w-5 text-muted-foreground" />
      </button>
    )}
  </div>
)

const DialogTitle = ({ className, ...props }) => (
  <h3
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
)

const DialogDescription = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)

const DialogContent = ({ className, ...props }) => (
  <div className={cn("p-6", className)} {...props} />
)

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t bg-slate-50 dark:bg-slate-900/50", className)}
    {...props}
  />
)

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter }
