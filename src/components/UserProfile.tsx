"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Shield, Briefcase, IdCard, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { updateUserProfile } from "../lib/actions";

export default function UserProfile() {
  const { data: session, update } = useSession();
  const user = session?.user as any;
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    staffId: user?.staffId || "",
    department: user?.department || "",
  });

  const [signature, setSignature] = useState(user?.signatureUrl || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const result = await updateUserProfile(user.id, {
        ...formData,
        signatureUrl: signature,
      });

      if (result.success) {
        setStatus({ type: "success", message: "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว" });
        // Update the session to reflect changes
        await update({
          ...session,
          user: {
            ...session?.user,
            ...formData,
            signatureUrl: signature,
          },
        });
      } else {
        setStatus({ type: "error", message: result.error || "เกิดข้อผิดพลาด" });
      }
    } catch (err) {
      setStatus({ type: "error", message: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-8 bg-zinc-900 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {user?.name?.[0] || user?.username?.[0] || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || user?.username}</h1>
              <p className="text-zinc-400 mt-1 flex items-center gap-2">
                <Shield size={14} />
                สิทธิ์การใช้งาน: {user?.role}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {status && (
            <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
              {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 border-b pb-2">ข้อมูลทั่วไป</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-600 mb-1.5 block">ชื่อ-นามสกุล</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <User size={18} />
                      </div>
                      <input 
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-zinc-600 mb-1.5 block">รหัสพนักงาน</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <IdCard size={18} />
                      </div>
                      <input 
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={formData.staffId}
                        onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-zinc-600 mb-1.5 block">แผนก / หน่วยงาน</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <Briefcase size={18} />
                      </div>
                      <input 
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 border-b pb-2">ลายเซ็นอิเล็กทรอนิกส์</h3>
                
                <div className="p-6 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center min-h-[200px] text-center">
                  {signature ? (
                    <div className="relative group w-full">
                      <img src={signature} alt="signature" className="max-h-32 mx-auto object-contain" />
                      <div className="mt-4 flex justify-center">
                        <label className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100 transition-all">
                          เปลี่ยนลายเซ็น
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-3">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm text-zinc-500 mb-4">ยังไม่ได้อัปโหลดลายเซ็น</p>
                      <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md">
                        อัปโหลดลายเซ็น
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </>
                  )}
                  <p className="mt-4 text-[10px] text-zinc-400">รองรับไฟล์ภาพ JPG, PNG (แนะนำพื้นหลังโปร่งใส)</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
