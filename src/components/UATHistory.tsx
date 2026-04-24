"use client";

import React, { useEffect, useState } from "react";
import { getUATHistory } from "../lib/actions";
import { FileText, Calendar, User, Search, Eye, Filter } from "lucide-react";
import { cn } from "../lib/utils";

interface UATHistoryProps {
  onViewDetails?: (id: string) => void;
  onCreateNew?: () => void;
}

const UATHistory = ({ onViewDetails, onCreateNew }: UATHistoryProps) => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getUATHistory();
      if (result.success) {
        setRecords(result.data || []);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const filteredRecords = records.filter(r => 
    r.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.docNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.testerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">ประวัติเอกสาร UAT</h1>
          <p className="text-zinc-500 mt-1">รายการเอกสาร User Acceptance Test ทั้งหมดในระบบ</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <FileText size={18} />
          สร้างเอกสารใหม่
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาตามชื่อโครงการ, เลขที่เอกสาร, หรือชื่อผู้ทดสอบ..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-zinc-200 rounded-lg flex items-center gap-2 hover:bg-zinc-50 font-medium text-zinc-600 transition-all">
            <Filter size={18} />
            ตัวกรอง
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500">กำลังโหลดประวัติเอกสาร...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left border-b border-zinc-200">
                  <th className="py-4 px-6 font-semibold text-zinc-600 text-sm">เลขที่เอกสาร</th>
                  <th className="py-4 px-6 font-semibold text-zinc-600 text-sm">ชื่อโครงการ</th>
                  <th className="py-4 px-6 font-semibold text-zinc-600 text-sm">วันที่สร้าง</th>
                  <th className="py-4 px-6 font-semibold text-zinc-600 text-sm">ผู้ทดสอบ</th>
                  <th className="py-4 px-6 font-semibold text-zinc-600 text-sm">สถานะ</th>
                  <th className="py-4 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-zinc-50 transition-all group">
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-700">{record.docNo || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-zinc-900">{record.projectName || 'ไม่ระบุชื่อโครงการ'}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">V: {record.systemVersion || '1.0.0'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-zinc-600 text-sm">
                        <Calendar size={14} />
                        {new Date(record.createDate).toLocaleDateString('th-TH')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-zinc-600 text-sm">
                        <User size={14} />
                        {record.testerName || 'ไม่ระบุ'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                        record.status === 'Completed' ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-zinc-50 text-zinc-700 ring-zinc-600/20"
                      )}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => onViewDetails?.(record.id)}
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
             <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                <FileText size={32} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-zinc-900">ไม่พบประวัติเอกสาร</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">คุณยังไม่ได้สร้างเอกสาร UAT ใดๆ เริ่มต้นสร้างเอกสารแรกได้ที่ปุ่มด้านบน</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UATHistory;
