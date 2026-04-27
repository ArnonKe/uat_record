"use client";

import React, { useState, useEffect } from "react";
import { getUATDashboardStats } from "../lib/actions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, Clock, CheckCircle } from "lucide-react";

interface DashboardData {
  total: number;
  completed: number;
  pending: number;
  monthlyData: { name: string; count: number }[];
}

export default function UATDashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number | "all">("all");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const m = month === "all" ? undefined : Number(month);
      const result = await getUATDashboardStats(year, m);
      if (result.success && result.data) {
        setData(result.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [year, month]);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "มกราคม" },
    { value: 2, label: "กุมภาพันธ์" },
    { value: 3, label: "มีนาคม" },
    { value: 4, label: "เมษายน" },
    { value: 5, label: "พฤษภาคม" },
    { value: 6, label: "มิถุนายน" },
    { value: 7, label: "กรกฎาคม" },
    { value: 8, label: "สิงหาคม" },
    { value: 9, label: "กันยายน" },
    { value: 10, label: "ตุลาคม" },
    { value: 11, label: "พฤศจิกายน" },
    { value: 12, label: "ธันวาคม" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">ภาพรวม UAT</h1>
          <p className="text-zinc-500 text-sm mt-1">
            สรุปข้อมูลและสถานะการทดสอบระบบประจำปี {year + 543}
          </p>
        </div>

        <div className="flex gap-3 bg-white p-2 rounded-lg shadow-sm border border-zinc-200">
          <select
            value={month}
            onChange={(e) =>
              setMonth(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="px-3 py-1.5 border border-zinc-300 rounded text-sm bg-zinc-50 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">ทุกเดือน</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1.5 border border-zinc-300 rounded text-sm bg-zinc-50 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                ปี {y + 543}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">UAT ทั้งหมด</p>
                <p className="text-3xl font-bold text-zinc-900">
                  {data?.total || 0}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  รอการยืนยัน (Pending)
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {data?.pending || 0}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  ดำเนินการเสร็จสิ้น (Completed)
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {data?.completed || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">
              จำนวน UAT ที่บันทึกเสร็จสิ้นในแต่ละเดือน (ปี {year + 543})
            </h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data?.monthlyData || []}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="จำนวนที่เสร็จสิ้น"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, fill: "#2563eb" }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
