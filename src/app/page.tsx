"use client";

import { useState } from "react";
import UATForm from "../components/UATForm";
import UATHistory from "../components/UATHistory";

export default function Home() {
  const [view, setView] = useState<"history" | "create">("history");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleViewDetails = async (id: string) => {
    // In a real app, you might want to fetch by ID if not already in history list
    // For this demo, we'll try to fetch fresh data
    const { getUATById } = await import("../lib/actions");
    const result = await getUATById(id);
    if (result.success) {
      setSelectedRecord(result.data);
      setView("create"); // Use create view but for viewing
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
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50 print:hidden no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between no-print">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">U</div>
              <span className="font-bold text-lg tracking-tight text-zinc-900">UAT Tracker</span>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setView("history")}
                className={`text-sm font-medium transition-colors ${view === 'history' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                ประวัติเอกสาร
              </button>
              <button 
                onClick={handleCreateNew}
                className={`text-sm font-medium transition-colors ${view === 'create' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                สร้างเอกสารใหม่
              </button>
           </div>
        </div>
      </nav>

      <main className="py-8">
        {view === "history" ? (
          <UATHistory 
            onCreateNew={handleCreateNew} 
            onViewDetails={handleViewDetails}
          />
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
          <p className="text-zinc-400 text-sm">© {new Date().getFullYear()} UAT Acceptance System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

