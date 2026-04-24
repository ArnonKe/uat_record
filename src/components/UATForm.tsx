"use client";

import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Trash2, Save, ArrowLeft, Download } from "lucide-react";
import { createUATDocument } from "../lib/actions";
import UATPrintView from "./UATPrintView";

interface TestCase {
  tcNo: string;
  testCaseDetail: string;
  status: string | null;
  remark: string;
}

interface UATFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UATForm = ({ initialData, onSuccess, onCancel }: UATFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: initialData?.projectName || "",
    docNo: initialData?.docNo || "",
    testerName: initialData?.testerName || "",
    staffId: initialData?.staffId || "",
    department: initialData?.department || "",
    phone: initialData?.phone || "",
    testLocation: initialData?.testLocation || "",
    testDate: initialData?.testDate
      ? new Date(initialData.testDate).toISOString().split("T")[0]
      : "",
    systemVersion: initialData?.systemVersion || "",
    referenceDoc: initialData?.referenceDoc || "",
    testResultSummary: initialData?.testResultSummary || "",
    testerSignName: initialData?.testerSignName || "",
    testerSignDate: initialData?.testerSignDate
      ? new Date(initialData.testerSignDate).toISOString().split("T")[0]
      : "",
    approverSignName: initialData?.approverSignName || "",
    approverSignDate: initialData?.approverSignDate
      ? new Date(initialData.approverSignDate).toISOString().split("T")[0]
      : "",
    programmerSignName: initialData?.programmerSignName || "",
    programmerSignDate: initialData?.programmerSignDate
      ? new Date(initialData.programmerSignDate).toISOString().split("T")[0]
      : "",
    deployerSignName: initialData?.deployerSignName || "",
    deployerSignDate: initialData?.deployerSignDate
      ? new Date(initialData.deployerSignDate).toISOString().split("T")[0]
      : "",
    appTeamLeadSignName: initialData?.appTeamLeadSignName || "",
    appTeamLeadSignDate: initialData?.appTeamLeadSignDate
      ? new Date(initialData.appTeamLeadSignDate).toISOString().split("T")[0]
      : "",
  });

  const [testCases, setTestCases] = useState<TestCase[]>(
    initialData?.testCases || [
      { tcNo: "1", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "2", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "3", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "4", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "5", testCaseDetail: "", status: null, remark: "" },
    ],
  );

  const isViewOnly = !!initialData;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (
    index: number,
    field: keyof TestCase,
    value: string | null,
  ) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      {
        tcNo: (testCases.length + 1).toString(),
        testCaseDetail: "",
        status: null,
        remark: "",
      },
    ]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      const newTestCases = testCases.filter((_, i) => i !== index);
      const reindexed = newTestCases.map((tc, i) => ({
        ...tc,
        tcNo: (i + 1).toString(),
      }));
      setTestCases(reindexed);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      testDate: formData.testDate ? new Date(formData.testDate) : null,
      testerSignDate: formData.testerSignDate
        ? new Date(formData.testerSignDate)
        : null,
      approverSignDate: formData.approverSignDate
        ? new Date(formData.approverSignDate)
        : null,
      programmerSignDate: formData.programmerSignDate
        ? new Date(formData.programmerSignDate)
        : null,
      deployerSignDate: formData.deployerSignDate
        ? new Date(formData.deployerSignDate)
        : null,
      appTeamLeadSignDate: formData.appTeamLeadSignDate
        ? new Date(formData.appTeamLeadSignDate)
        : null,
      testCases,
      status: "Completed",
    };

    const result = await createUATDocument(payload);
    setLoading(false);

    if (result.success) {
      alert("บันทึกข้อมูล UAT สำเร็จ");
      onSuccess?.();
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const inputCls =
    "flex-1 border-b border-dotted border-black focus:outline-none bg-transparent text-[13px] placeholder-black/25 min-w-0";
  const labelCls = "font-bold whitespace-nowrap text-[13px]";

  return (
    <>
      {/* Print-only view */}
      <div className="print-only">
        <UATPrintView data={{ ...formData, testCases }} />
      </div>

      {/* Screen view */}
      <div className="max-w-[210mm] mx-auto mb-20 bg-white shadow-2xl overflow-hidden no-print border border-zinc-200">
        {/* Top action bar */}
        <div className="px-8 py-3 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center no-print sticky top-0 z-50 shadow-sm">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-all font-semibold text-sm"
          >
            <ArrowLeft size={16} />
            กลับหน้าประวัติ
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-1.5 border border-zinc-300 rounded bg-white text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm text-sm font-medium"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={loading || isViewOnly}
              className="flex items-center gap-2 px-5 py-1.5 bg-zinc-900 text-white rounded hover:bg-black transition-all disabled:opacity-50 shadow text-sm font-medium"
            >
              <Save size={16} />
              {loading
                ? "กำลังบันทึก..."
                : isViewOnly
                  ? "โหมดมุมมอง"
                  : "บันทึกเอกสาร"}
            </button>
          </div>
        </div>

        {/* Document body */}
        <div
          className="p-[20mm] text-black"
          style={{
            fontFamily: "'TH Sarabun New', 'Sarabun', sans-serif",
            fontSize: "13px",
            lineHeight: "1.4",
          }}
        >
          {/* Logo placeholder — ใส่ <img> แทน div นี้ภายหลังได้เลย */}
          <div className="flex flex-col items-start">
            <img
              src="/logonew.png"
              alt="SC Group Logo"
              style={{
                width: "70px",
                display: "block",
              }}
            />
          </div>
          {/* ===== HEADER ===== */}
          <div className="flex justify-between items-start mb-5 relative">
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <div className="font-bold text-[18px]">User Acceptance Test</div>
              <div className="font-bold text-[14px] mt-0.5">
                แบบฟอร์มการรับรองการทดสอบระบบโดยผู้ใช้งาน
              </div>
            </div>

            <div className="font-bold text-[13px]">UAT</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ===== SECTION 1 ===== */}
            <section>
              <div className="font-bold mb-1 flex gap-1 text-[14px]">
                <span>1.</span>
                <span>ข้อมูลทั่วไปของโครงการ</span>
              </div>
              <div className="space-y-[3px] pl-5">
                {/* ชื่อโครงการ */}
                <div className="flex gap-2 items-baseline">
                  <span className={labelCls}>ชื่อโครงการ</span>
                  <input
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    readOnly={isViewOnly}
                    className={inputCls}
                    placeholder="........................................................................................................"
                  />
                </div>

                {/* Document Number / Create Date */}
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>Document Number</span>
                    <input
                      name="docNo"
                      value={formData.docNo}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={inputCls}
                      placeholder="........................................................................"
                    />
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>Create Date</span>
                    <input
                      readOnly
                      value={new Date().toLocaleDateString("th-TH")}
                      className={cn(inputCls, "text-center")}
                    />
                  </div>
                </div>

                {/* ผู้ทดสอบ / รหัสพนักงาน */}
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>ผู้ทดสอบ (UAT Tester)</span>
                    <input
                      name="testerName"
                      value={formData.testerName}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={inputCls}
                      placeholder="........................................................................"
                    />
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>รหัสพนักงาน</span>
                    <input
                      name="staffId"
                      value={formData.staffId}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={inputCls}
                      placeholder="........................................................................"
                    />
                  </div>
                </div>

                {/* หน่วยงาน / เบอร์โทร */}
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>หน่วยงาน/แผนก</span>
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={inputCls}
                      placeholder="........................................................................"
                    />
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>เบอร์โทร</span>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={inputCls}
                      placeholder="........................................................................"
                    />
                  </div>
                </div>

                {/* สถานที่ทดสอบ / วันที่ทดสอบ */}
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>สถานที่ทดสอบ</span>
                    <input
                      name="testLocation"
                      value={formData.testLocation}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={inputCls}
                      placeholder="........................................................................"
                    />
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <span className={labelCls}>วันที่ทดสอบ</span>
                    <input
                      type="date"
                      name="testDate"
                      value={formData.testDate}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={cn(inputCls, "text-center")}
                    />
                  </div>
                </div>

                {/* เวอร์ชัน */}
                <div className="flex gap-2 items-baseline">
                  <span className={labelCls}>เวอร์ชันระบบที่ทดสอบ</span>
                  <input
                    name="systemVersion"
                    value={formData.systemVersion}
                    onChange={handleInputChange}
                    readOnly={isViewOnly}
                    className={inputCls}
                    placeholder="........................................................................................................"
                  />
                </div>

                {/* เอกสารอ้างอิง */}
                <div className="flex gap-2 items-baseline">
                  <span className={labelCls}>เอกสารอ้างอิง</span>
                  <input
                    name="referenceDoc"
                    value={formData.referenceDoc}
                    onChange={handleInputChange}
                    readOnly={isViewOnly}
                    className={inputCls}
                    placeholder="........................................................................................................"
                  />
                </div>
              </div>
            </section>

            {/* ===== SECTION 2 ===== */}
            <section>
              <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold flex gap-1 text-[14px]">
                  <span>2.</span>
                  <span>รายละเอียด Test Case</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] italic underline">
                    แนบเอกสารเพิ่มเติมหากมีขั้นตอนประกอบ
                  </span>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={addTestCase}
                      className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 hover:bg-zinc-200 transition-colors"
                    >
                      + เพิ่มรายการ
                    </button>
                  )}
                </div>
              </div>

              <table className="w-full border-collapse border border-black text-center text-[12px]">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-black p-1 w-14 font-bold">
                      TC no.
                    </th>
                    <th className="border border-black p-1 font-bold">
                      รายละเอียด Test Case
                    </th>
                    <th className="border border-black p-1 w-16 font-bold">
                      สถานะ
                    </th>
                    <th className="border border-black p-1 w-36 font-bold">
                      หมายเหตุ
                    </th>
                    {!isViewOnly && <th className="border-none w-5"></th>}
                  </tr>
                </thead>
                <tbody>
                  {testCases.map((tc, index) => (
                    <tr key={index} className="h-7">
                      <td className="border border-black p-0">
                        <input
                          value={tc.tcNo}
                          onChange={(e) =>
                            handleTestCaseChange(index, "tcNo", e.target.value)
                          }
                          readOnly={isViewOnly}
                          className="w-full text-center bg-transparent focus:outline-none text-[12px] py-1"
                        />
                      </td>
                      <td className="border border-black p-0">
                        <input
                          value={tc.testCaseDetail}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "testCaseDetail",
                              e.target.value,
                            )
                          }
                          readOnly={isViewOnly}
                          className="w-full bg-transparent focus:outline-none text-[12px] px-2 py-1"
                        />
                      </td>
                      <td className="border border-black p-0">
                        {/* Single checkbox — ✓ = Pass, X = Fail, empty = ไม่ได้เลือก */}
                        <div className="flex justify-center items-center gap-1 py-1">
                          <button
                            type="button"
                            onClick={() =>
                              !isViewOnly &&
                              handleTestCaseChange(
                                index,
                                "status",
                                tc.status === "Pass" ? null : "Pass",
                              )
                            }
                            title="Pass"
                            className={cn(
                              "w-4 h-4 border border-black flex items-center justify-center text-[10px] transition-colors",
                              tc.status === "Pass"
                                ? "bg-black text-white"
                                : "bg-white hover:bg-zinc-100",
                            )}
                          >
                            {tc.status === "Pass" ? "✓" : ""}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              !isViewOnly &&
                              handleTestCaseChange(
                                index,
                                "status",
                                tc.status === "Fail" ? null : "Fail",
                              )
                            }
                            title="Fail"
                            className={cn(
                              "w-4 h-4 border border-black flex items-center justify-center text-[10px] transition-colors",
                              tc.status === "Fail"
                                ? "bg-black text-white"
                                : "bg-white hover:bg-zinc-100",
                            )}
                          >
                            {tc.status === "Fail" ? "X" : ""}
                          </button>
                        </div>
                      </td>
                      <td className="border border-black p-0">
                        <input
                          value={tc.remark}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "remark",
                              e.target.value,
                            )
                          }
                          readOnly={isViewOnly}
                          className="w-full bg-transparent focus:outline-none text-[12px] px-2 py-1"
                        />
                      </td>
                      {!isViewOnly && (
                        <td className="p-0 border-none pl-1">
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="text-zinc-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[10px] font-bold mt-1 ml-4 italic">
                ** หมายเหตุ : สถานะ ✓ = ผ่าน / X = ไม่ผ่าน
              </div>
            </section>

            {/* ===== SECTION 3 ===== */}
            <section>
              <div className="font-bold mb-1 flex gap-1 text-[14px]">
                <span>3.</span>
                <span>ข้อเสนอแนะและผลทดสอบ</span>
              </div>
              <div className="pl-5 space-y-2">
                <div className="border-b border-dotted border-black min-h-[20px]">
                  <textarea
                    name="testResultSummary"
                    value={formData.testResultSummary}
                    onChange={handleInputChange}
                    readOnly={isViewOnly}
                    rows={2}
                    className="w-full bg-transparent focus:outline-none text-[13px] resize-none leading-relaxed"
                    placeholder="รายละเอียดผลการทดสอบหรือข้อเสนอแนะ"
                  />
                </div>
                <div className="border-b border-dotted border-black h-5"></div>
              </div>
            </section>

            {/* ===== SECTION 4 ===== */}
            <section>
              <div className="font-bold mb-1 flex gap-1 text-[14px]">
                <span>4.</span>
                <span>ผู้รับรองผลการทดสอบ</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pl-5">
                {/* ผู้ทดสอบ */}
                <div className="border border-black p-3 space-y-3">
                  <div className="font-bold text-[12px] underline">
                    สำหรับผู้ทดสอบ :
                  </div>
                  <div className="text-center text-[12px]">
                    (ลงนาม) ผู้ทดสอบ
                  </div>
                  <div className="h-8"></div>
                  <div className="space-y-1.5 px-2">
                    <div className="border-b border-dotted border-black text-center text-[12px] min-h-[20px] flex items-center justify-center">
                      <span>(</span>
                      <input
                        name="testerSignName"
                        value={formData.testerSignName}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="flex-1 bg-transparent focus:outline-none text-center text-[12px]"
                        placeholder="..................................................."
                      />
                      <span>)</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-2 text-[12px]">
                      <span className="font-bold">วันที่</span>
                      <input
                        type="date"
                        name="testerSignDate"
                        value={formData.testerSignDate}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="border-b border-dotted border-black bg-transparent focus:outline-none w-[120px] text-center text-[12px]"
                      />
                    </div>
                  </div>
                </div>

                {/* ผู้รับรอง */}
                <div className="border border-black p-3 space-y-3">
                  <div className="font-bold text-[12px] underline">
                    สำหรับผู้รับรอง :
                  </div>
                  <div className="text-center text-[12px]">
                    (ลงนาม) ผู้บังคับบัญชา
                  </div>
                  <div className="h-8"></div>
                  <div className="space-y-1.5 px-2">
                    <div className="border-b border-dotted border-black text-center text-[12px] min-h-[20px] flex items-center justify-center">
                      <span>(</span>
                      <input
                        name="approverSignName"
                        value={formData.approverSignName}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="flex-1 bg-transparent focus:outline-none text-center text-[12px]"
                        placeholder="..................................................."
                      />
                      <span>)</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-2 text-[12px]">
                      <span className="font-bold">วันที่</span>
                      <input
                        type="date"
                        name="approverSignDate"
                        value={formData.approverSignDate}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="border-b border-dotted border-black bg-transparent focus:outline-none w-[120px] text-center text-[12px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== SECTION 5 ===== */}
            <section>
              <div className="font-bold mb-1 flex gap-1 text-[14px]">
                <span>5.</span>
                <span>ผู้รับรองผลการทดสอบ</span>
              </div>
              <div className="grid grid-cols-3 border border-black ml-5 divide-x divide-black">
                {/* Programmer */}
                <div className="p-2 space-y-3 min-h-[120px] flex flex-col">
                  <div className="font-bold text-[10px] underline">
                    สำหรับผู้ดำเนินการ (Programmer) :
                  </div>
                  <div className="text-center text-[10px] italic">
                    (ลงนาม) ผู้พัฒนา
                  </div>
                  <div className="flex-1"></div>
                  <div className="space-y-1.5">
                    <div className="border-b border-dotted border-black text-center text-[10px] min-h-[18px] flex items-center justify-center px-1">
                      <span>(</span>
                      <input
                        name="programmerSignName"
                        value={formData.programmerSignName}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="flex-1 bg-transparent focus:outline-none text-center text-[10px]"
                        placeholder="................................................."
                      />
                      <span>)</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-1 text-[10px]">
                      <span className="font-bold">วันที่</span>
                      <input
                        type="date"
                        name="programmerSignDate"
                        value={formData.programmerSignDate}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="border-b border-dotted border-black bg-transparent focus:outline-none flex-1 text-center text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Deploy */}
                <div className="p-2 space-y-3 min-h-[120px] flex flex-col">
                  <div className="font-bold text-[10px] underline">
                    สำหรับผู้ดำเนินการ (Deploy) :
                  </div>
                  <div className="text-center text-[10px] italic">
                    (ลงนาม) ผู้ Deploy
                  </div>
                  <div className="flex-1"></div>
                  <div className="space-y-1.5">
                    <div className="border-b border-dotted border-black text-center text-[10px] min-h-[18px] flex items-center justify-center px-1">
                      <span>(</span>
                      <input
                        name="deployerSignName"
                        value={formData.deployerSignName}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="flex-1 bg-transparent focus:outline-none text-center text-[10px]"
                        placeholder="................................................."
                      />
                      <span>)</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-1 text-[10px]">
                      <span className="font-bold">วันที่</span>
                      <input
                        type="date"
                        name="deployerSignDate"
                        value={formData.deployerSignDate}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="border-b border-dotted border-black bg-transparent focus:outline-none flex-1 text-center text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Approver */}
                <div className="p-2 space-y-3 min-h-[120px] flex flex-col">
                  <div className="font-bold text-[10px] underline">
                    สำหรับผู้อนุมัติ :
                  </div>
                  <div className="text-center text-[10px] italic">
                    (ลงนาม) หัวหน้าทีม Application
                  </div>
                  <div className="flex-1"></div>
                  <div className="space-y-1.5">
                    <div className="border-b border-dotted border-black text-center text-[10px] min-h-[18px] flex items-center justify-center px-1">
                      <span>(</span>
                      <input
                        name="appTeamLeadSignName"
                        value={formData.appTeamLeadSignName}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="flex-1 bg-transparent focus:outline-none text-center text-[10px]"
                        placeholder="................................................."
                      />
                      <span>)</span>
                    </div>
                    <div className="flex justify-center items-baseline gap-1 text-[10px]">
                      <span className="font-bold">วันที่</span>
                      <input
                        type="date"
                        name="appTeamLeadSignDate"
                        value={formData.appTeamLeadSignDate}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className="border-b border-dotted border-black bg-transparent focus:outline-none flex-1 text-center text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </form>

          {/* Footer */}
          <div className="mt-8 flex justify-end no-print">
            <span className="font-bold text-[11px]">
              FM-IT-14 : Rev 13/06/68
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UATForm;
