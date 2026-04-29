"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import UATForm from "../components/UATForm";
import UATHistory from "../components/UATHistory";
import UATDashboard from "../components/UATDashboard";
import UserProfile from "../components/UserProfile";
import NotificationBell from "../components/NotificationBell";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [view, setView] = useState<"history" | "create" | "dashboard" | "profile">("dashboard");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-zinc-500 font-medium">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  if (!session) return null;

  const handleViewDetails = async (id: string) => {
    const { getUATById } = await import("../lib/actions");
    const result = await getUATById(id);
    if (result.success) {
      setSelectedRecord(result.data);
      setView("create");
    } else {
      alert("ไม่สามารถดึงข้อมูลได้: " + result.error);
    }
  };

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setView("create");
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50 print:hidden no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 md:gap-3 shrink-0 cursor-pointer" onClick={() => setView("dashboard")}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              U
            </div>
            <span className="font-bold text-base md:text-lg tracking-tight text-zinc-900 hidden sm:block">
              UAT Tracker
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden md:flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setView("dashboard")}
                className={`text-sm font-semibold transition-colors whitespace-nowrap ${view === "dashboard" ? "text-blue-600" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                หน้าแรก
              </button>
              <button
                onClick={() => setView("history")}
                className={`text-sm font-semibold transition-colors whitespace-nowrap ${view === "history" ? "text-blue-600" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                ประวัติ
              </button>
              <button
                onClick={handleCreateNew}
                className={`text-sm font-semibold transition-colors whitespace-nowrap ${view === "create" ? "text-blue-600" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                สร้างใหม่
              </button>
            </div>

            <div className="flex items-center gap-3 pl-2 md:pl-6 md:border-l border-zinc-200">
              <NotificationBell />
              
              <div className="flex items-center gap-3 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-200">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                  {(session.user as any)?.signatureUrl ? (
                    <img src={(session.user as any).signatureUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={14} />
                  )}
                </div>
                <div className="hidden lg:block text-xs text-zinc-600 font-medium max-w-[100px] truncate">
                  {session.user?.name || (session.user as any).username}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setView("profile")}
                    className={`transition-colors p-1 ${view === 'profile' ? 'text-blue-600' : 'text-zinc-400 hover:text-blue-600'}`}
                    title="ข้อมูลส่วนตัว"
                  >
                    <UserIcon size={16} />
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                    title="ออกจากระบบ"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Sub-nav */}
        <div className="md:hidden flex items-center justify-center gap-6 border-t border-zinc-100 py-2 bg-white overflow-x-auto no-scrollbar">
          <button
            onClick={() => setView("dashboard")}
            className={`text-xs font-bold transition-colors whitespace-nowrap ${view === "dashboard" ? "text-blue-600" : "text-zinc-400"}`}
          >
            หน้าแรก
          </button>
          <button
            onClick={() => setView("history")}
            className={`text-xs font-bold transition-colors whitespace-nowrap ${view === "history" ? "text-blue-600" : "text-zinc-400"}`}
          >
            ประวัติ
          </button>
          <button
            onClick={handleCreateNew}
            className={`text-xs font-bold transition-colors whitespace-nowrap ${view === "create" ? "text-blue-600" : "text-zinc-400"}`}
          >
            สร้างใหม่
          </button>
          <button
            onClick={() => setView("profile")}
            className={`text-xs font-bold transition-colors whitespace-nowrap ${view === "profile" ? "text-blue-600" : "text-zinc-400"}`}
          >
            โปรไฟล์
          </button>
        </div>
      </nav>

      <main className="py-8">
        {view === "dashboard" ? (
          <UATDashboard />
        ) : view === "history" ? (
          <UATHistory
            onCreateNew={handleCreateNew}
            onViewDetails={handleViewDetails}
          />
        ) : view === "profile" ? (
          <UserProfile />
        ) : (
          <UATForm
            initialData={selectedRecord}
            onSuccess={() => setView("history")}
            onCancel={() => setView("history")}
          />
        )}
      </main>

      <footer className="py-12 border-t border-zinc-200 bg-white print:hidden no-print">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} UAT Acceptance System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

