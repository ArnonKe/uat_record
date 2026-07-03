"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";

type LoginFormProps = {
  initialError: string | null;
};

const ERROR_INVALID_CREDENTIALS =
  "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
const ERROR_CONNECTION =
  "เกิดข้อผิดพลาดในการเชื่อมต่อ";
const ERROR_CONFIGURATION =
  "ระบบยืนยันตัวยังไม่ได้ตั้งค่าในสภาพแวดล้อมการ deploy";
const ERROR_GENERIC =
  "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
const TITLE = "เข้าสู่ระบบ UAT Tracker";
const DESCRIPTION =
  "กรุณาเข้าสู่ระบบเพื่อจัดการเอกสาร UAT ของคุณ";
const USERNAME_LABEL = "ชื่อผู้ใช้ (Username)";
const USERNAME_PLACEHOLDER =
  "กรอกชื่อผู้ใช้";
const PASSWORD_LABEL = "รหัสผ่าน (Password)";
const PASSWORD_PLACEHOLDER =
  "กรอกรหัสผ่าน";
const SUBMIT_TEXT = "เข้าสู่ระบบ";

export default function LoginForm({ initialError }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(ERROR_INVALID_CREDENTIALS);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError(ERROR_CONNECTION);
    } finally {
      setLoading(false);
    }
  };

  const message =
    error ||
    (initialError === "Configuration"
      ? ERROR_CONFIGURATION
      : initialError === "CredentialsSignin"
        ? ERROR_INVALID_CREDENTIALS
        : initialError
          ? ERROR_GENERIC
          : "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-zinc-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-6">
            U
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            {TITLE}
          </h2>
          <p className="mt-2 text-zinc-500">{DESCRIPTION}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center animate-shake">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-semibold text-zinc-700 mb-1 block">
                {USERNAME_LABEL}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-zinc-900"
                  placeholder={USERNAME_PLACEHOLDER}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-semibold text-zinc-700 mb-1 block">
                {PASSWORD_LABEL}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  autoComplete="off"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-zinc-900"
                  placeholder={PASSWORD_PLACEHOLDER}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : SUBMIT_TEXT}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-400 mt-8">
          © {new Date().getFullYear()} UAT Acceptance System
        </div>
      </div>
    </div>
  );
}
