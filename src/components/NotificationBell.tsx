"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, AlertCircle } from "lucide-react";
import { getNotifications } from "../lib/actions";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      const result = await getNotifications();
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    };
    fetchNotifs();

    // Refresh every 5 minutes
    const interval = setInterval(fetchNotifs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors relative focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-zinc-800 text-sm">การแจ้งเตือน</h3>
            <span className="text-xs text-zinc-500">{unreadCount} รายการ</span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                ไม่มีการแจ้งเตือนใหม่
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 hover:bg-zinc-50 transition-colors flex gap-3 items-start"
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.level === "red" ? (
                        <AlertCircle className="text-red-500" size={18} />
                      ) : (
                        <AlertTriangle className="text-amber-500" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 line-clamp-1">
                        {notif.projectName || "ไม่ระบุชื่อโครงการ"}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        เลขที่: {notif.docNo || "N/A"}
                      </p>
                      <p className={`text-xs mt-1.5 font-medium ${notif.level === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
                        ค้างมาแล้ว {notif.days} วัน
                        {notif.level === 'red' ? ' (เกิน 1 เดือน)' : ' (เกิน 1 สัปดาห์)'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
