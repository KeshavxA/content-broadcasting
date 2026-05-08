"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import {
  LayoutDashboard,
  Upload,
  Library,
  ShieldCheck,
  Pending,
  ListChecks,
  LogOut,
  Menu,
  X,
  User,
  Video
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const teacherLinks = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Upload Content', href: '/teacher/upload', icon: Upload },
    { name: 'My Content', href: '/teacher/content', icon: Library },
  ];

  const principalLinks = [
    { name: 'Dashboard', href: '/principal/dashboard', icon: ShieldCheck },
    { name: 'Pending Approvals', href: '/principal/approvals', icon: ListChecks },
    { name: 'Broadcast Archives', href: '/principal/content', icon: Library },
  ];

  const links = user?.role === 'principal' ? principalLinks : teacherLinks;

  return (
    <>

      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r transition-transform duration-300 transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">

          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Broadcaster</span>
          </div>


          <nav className="flex-1 px-4 space-y-2 mt-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-4">
              Main Menu
            </p>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                  )}
                >
                  <link.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "group-hover:scale-110 transition-transform"
                  )} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4">
              <img src={user?.avatar} alt={user?.name} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-800" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-3"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              Logout Session
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
