"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Trash2, Save, ArrowLeft, Download } from "lucide-react";
import { createUATDocument } from "../lib/actions";
import UATPrintView from "./UATPrintView";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
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
    programmerSignatureUrl: initialData?.programmerSignatureUrl || "",
  });

  // Auto-fill from session for new documents
  useEffect(() => {
    if (!initialData && session?.user) {
      const user = session.user as any;
      setFormData((prev) => ({
        ...prev,
        testerName: prev.testerName || user.name || user.username || "",
        staffId: prev.staffId || user.staffId || "",
        department: prev.department || user.department || "",
        // If user is a Dev, pre-fill programmer section too
        programmerSignName:
          user.role === "DEV"
            ? user.name || user.username || ""
            : prev.programmerSignName,
        programmerSignatureUrl:
          user.role === "DEV"
            ? user.signatureUrl || ""
            : prev.programmerSignatureUrl,
      }));
    }
  }, [session, initialData]);

  const [testCases, setTestCases] = useState<TestCase[]>(
    initialData?.testCases || [
      { tcNo: "1", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "2", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "3", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "4", testCaseDetail: "", status: null, remark: "" },
      { tcNo: "5", testCaseDetail: "", status: null, remark: "" },
    ],
  );

  const [errors, setErrors] = useState<string[]>([]);

  const isViewOnly =
    initialData &&
    (initialData.status === "Completed" || initialData.status === "Cancelled");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors.includes(name)) {
      setErrors((prev) => prev.filter((err) => err !== name));
    }
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

    // Validation: Check required fields
    const requiredFields = [
      { key: "projectName", label: "ชื่อโครงการ" },
      { key: "docNo", label: "Document Number" },
      { key: "testerName", label: "ผู้ทดสอบ (UAT Tester)" },
      { key: "staffId", label: "รหัสพนักงาน" },
      { key: "department", label: "หน่วยงาน/แผนก" },
      { key: "phone", label: "เบอร์โทรศัพท์" },
      { key: "testLocation", label: "สถานที่ทดสอบ" },
      { key: "testDate", label: "วันที่ทดสอบ" },
      { key: "systemVersion", label: "เวอร์ชันระบบ" },
      { key: "referenceDoc", label: "เอกสารอ้างอิง" },
      { key: "testResultSummary", label: "ข้อเสนอแนะและผลทดสอบ" },
      { key: "testerSignName", label: "ชื่อผู้ทดสอบ (ลงนาม)" },
      { key: "testerSignDate", label: "วันที่ผู้ทดสอบลงนาม" },
      { key: "approverSignName", label: "ชื่อผู้รับรอง (ลงนาม)" },
      { key: "approverSignDate", label: "วันที่ผู้รับรองลงนาม" },
      { key: "programmerSignName", label: "ชื่อผู้พัฒนา (ลงนาม)" },
      { key: "programmerSignDate", label: "วันที่ผู้พัฒนาลงนาม" },
      { key: "deployerSignName", label: "ชื่อผู้ Deploy (ลงนาม)" },
      { key: "deployerSignDate", label: "วันที่ผู้ Deployลงนาม" },
      { key: "appTeamLeadSignName", label: "ชื่อหัวหน้าทีม (ลงนาม)" },
      { key: "appTeamLeadSignDate", label: "วันที่หัวหน้าทีมลงนาม" },
    ];

    const newErrors: string[] = [];
    requiredFields.forEach((f) => {
      if (!formData[f.key as keyof typeof formData]) {
        newErrors.push(f.key);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      alert("กรุณาระบุข้อมูลในช่องสีแดงให้ครบถ้วน");
      const firstError = document.getElementsByName(newErrors[0])[0];
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    setErrors([]);

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
      status: initialData?.status || "Pending",
    };

    try {
      const result = await createUATDocument(payload);
      if (result.success) {
        alert("บันทึกข้อมูล UAT สำเร็จ");
        onSuccess?.();
      } else {
        alert(
          "เกิดข้อผิดพลาดในการบันทึก: " + (result.error || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  const getInputCls = (name: string, extra?: string) =>
    cn(
      "border-b border-dotted border-black bg-transparent focus:outline-none placeholder-zinc-400 transition-all text-center pb-[2px]",
      "hover:bg-zinc-100/50 focus:bg-zinc-50 focus:border-solid",
      errors.includes(name) ? "border-red-500 bg-red-50 !border-solid" : "",
      extra,
    );

  return (
    <>
      {/* Print-only view */}
      <div className="print-only">
        <UATPrintView data={{ ...formData, testCases }} />
      </div>

      {/* Screen view */}
      <div className="uat-document-container max-w-[210mm] mx-auto mb-20 bg-white shadow-2xl overflow-hidden no-print border border-zinc-200">
        {/* Top action bar */}
        <div className="px-4 md:px-8 py-3 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center no-print sticky top-0 z-50 shadow-sm gap-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-all font-semibold text-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden xs:block">กลับ</span>
          </button>
          <div className="flex gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 border border-zinc-300 rounded bg-white text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm text-sm font-medium"
            >
              <Download size={16} />
              <span className="hidden sm:block">Export PDF</span>
              <span className="sm:hidden text-xs">PDF</span>
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={loading || isViewOnly}
              className="flex items-center gap-2 px-4 md:px-5 py-1.5 bg-zinc-900 text-white rounded hover:bg-black transition-all disabled:opacity-50 shadow text-sm font-medium whitespace-nowrap"
            >
              <Save size={16} />
              <span>{loading ? "..." : isViewOnly ? "View" : "บันทึก"}</span>
            </button>
          </div>
        </div>

        {/* Document body (WYSIWYG A4) */}
        <div
          style={{
            fontFamily:
              "'Times New Roman', 'TH Sarabun New', 'Sarabun', sans-serif",
            fontSize: "16px",
            lineHeight: "1.0",
            width: "90%",
            padding: "3mm",
            paddingTop: "20mm",
            margin: "0 auto",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            color: "black",
          }}
        >
          <div style={{ flex: 1 }}>
            {/* ===== HEADER ===== */}
            <div
              className="header-section"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              {/* Logo */}
              <div style={{ width: "80px" }}>
                <img
                  src="/logonew.png"
                  alt="SC Group Logo"
                  style={{ width: "70px", height: "auto", display: "block" }}
                />
              </div>

              {/* Title Block */}
              <div
                style={{
                  textAlign: "center",
                  flex: 1,
                  paddingTop: "10px",
                  marginTop: "25px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "22px",
                    lineHeight: "1.2",
                  }}
                >
                  User Acceptance Test
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    marginTop: "2px",
                    fontFamily: "'Browallia New', sans-serif",
                  }}
                >
                  แบบฟอร์มการรับรองการทดสอบระบบโดยผู้ใช้งาน
                </div>
              </div>

              {/* UAT Label */}
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "80px",
                  textAlign: "right",
                  paddingTop: "10px",
                  marginTop: "30px",
                }}
              >
                UAT
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* ===== SECTION 1 ===== */}
              <section
                style={{
                  marginBottom: "8px",
                  fontFamily: "'Angsana New', sans-serif",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "24px",
                    marginBottom: "6px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <span>1.</span>
                  <span>ข้อมูลทั่วไปของโครงการ</span>
                </div>
                <div style={{ paddingLeft: "20px", fontSize: "20px" }}>
                  {/* ชื่อโครงการ */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "baseline",
                      marginBottom: "2px",
                      fontSize: "20px",
                    }}
                  >
                    <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                      ชื่อโครงการ
                    </span>
                    <input
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={getInputCls("projectName", "flex-1 text-left")}
                    />
                  </div>

                  {/* Document Number / Create Date */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "32px",
                      marginBottom: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        Document Number
                      </span>
                      <input
                        name="docNo"
                        value={formData.docNo}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className={getInputCls("docNo", "flex-1 text-left")}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        Create Date
                      </span>
                      <input
                        readOnly
                        value={new Date().toLocaleDateString("th-TH")}
                        className={getInputCls(
                          "createDate",
                          "flex-1 text-center",
                        )}
                      />
                    </div>
                  </div>

                  {/* ผู้ทดสอบ / รหัสพนักงาน */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "32px",
                      marginBottom: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        ผู้ทดสอบ (UAT Tester)
                      </span>
                      <input
                        name="testerName"
                        //alue={formData.testerName}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className={getInputCls(
                          "testerName",
                          "flex-1 text-left",
                        )}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        รหัสพนักงาน
                      </span>
                      <input
                        name="staffId"
                        //value={formData.staffId}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className={getInputCls("staffId", "flex-1 text-left")}
                      />
                    </div>
                  </div>

                  {/* หน่วยงาน / เบอร์โทร */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "32px",
                      marginBottom: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        หน่วยงาน/แผนก
                      </span>
                      <input
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className={getInputCls(
                          "department",
                          "flex-1 text-left",
                        )}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        เบอร์โทร
                      </span>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className={getInputCls("phone", "flex-1 text-left")}
                      />
                    </div>
                  </div>

                  {/* สถานที่ทดสอบ / วันที่ทดสอบ */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "32px",
                      marginBottom: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        สถานที่ทดสอบ
                      </span>
                      <input
                        name="testLocation"
                        value={formData.testLocation}
                        onChange={handleInputChange}
                        readOnly={isViewOnly}
                        className={getInputCls(
                          "testLocation",
                          "flex-1 text-left",
                        )}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                        วันที่ทดสอบ
                      </span>
                      <div className="flex-1 relative flex items-center">
                        <input
                          type="date"
                          name="testDate"
                          value={formData.testDate}
                          onChange={handleInputChange}
                          readOnly={isViewOnly}
                          className={getInputCls(
                            "testDate",
                            "w-full text-center relative z-10 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* เวอร์ชัน */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                      เวอร์ชันระบบที่ทดสอบ
                    </span>
                    <input
                      name="systemVersion"
                      value={formData.systemVersion}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={getInputCls(
                        "systemVersion",
                        "flex-1 text-left",
                      )}
                    />
                  </div>

                  {/* เอกสารอ้างอิง */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                      เอกสารอ้างอิง
                    </span>
                    <input
                      name="referenceDoc"
                      value={formData.referenceDoc}
                      onChange={handleInputChange}
                      readOnly={isViewOnly}
                      className={getInputCls(
                        "referenceDoc",
                        "flex-1 text-left",
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* ===== SECTION 2 ===== */}
              <section
                style={{
                  marginBottom: "5px",
                  fontFamily: "'Angsana New', sans-serif",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "3px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "24px",
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    <span>2.</span>
                    <span>รายละเอียด Test Case</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        fontSize: "14px",
                        fontStyle: "italic",
                        textDecoration: "underline",
                        paddingRight: "4px",
                      }}
                    >
                      แนบเอกสารเพิ่มเติมหากมีขั้นตอนประกอบ
                    </span>
                    {!isViewOnly && (
                      <button
                        type="button"
                        onClick={addTestCase}
                        className="text-[12px] bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 hover:bg-zinc-200 transition-colors"
                      >
                        + เพิ่มรายการ
                      </button>
                    )}
                  </div>
                </div>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "24px",
                    textAlign: "center",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          width: "56px",
                          fontWeight: "bold",
                        }}
                      >
                        TC no.
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        รายละเอียด Test Case
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          width: "60px",
                          fontWeight: "bold",
                        }}
                      >
                        สถานะ
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          width: "140px",
                          fontWeight: "bold",
                        }}
                      >
                        หมายเหตุ
                      </th>
                      {!isViewOnly && (
                        <th style={{ width: "30px", border: "none" }}></th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {testCases.map((tc, index) => (
                      <tr key={index} style={{ height: "22px" }}>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "0",
                          }}
                        >
                          <input
                            value={tc.tcNo}
                            onChange={(e) =>
                              handleTestCaseChange(
                                index,
                                "tcNo",
                                e.target.value,
                              )
                            }
                            readOnly={isViewOnly}
                            className="w-full text-center bg-transparent focus:outline-none"
                            style={{ fontSize: "20px" }}
                          />
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "0 4px",
                            textAlign: "left",
                          }}
                        >
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
                            className="w-full bg-transparent focus:outline-none"
                            style={{ fontSize: "20px" }}
                          />
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "2px 4px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
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
                              style={{
                                width: "16px",
                                height: "16px",
                                border: "1px solid black",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "15px",
                                fontWeight: "bold",
                                backgroundColor:
                                  tc.status === "Pass"
                                    ? "black"
                                    : "transparent",
                                color: tc.status === "Pass" ? "white" : "black",
                                cursor: isViewOnly ? "default" : "pointer",
                              }}
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
                              style={{
                                width: "16px",
                                height: "16px",
                                border: "1px solid black",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "15px",
                                fontWeight: "bold",
                                backgroundColor:
                                  tc.status === "Fail"
                                    ? "black"
                                    : "transparent",
                                color: tc.status === "Fail" ? "white" : "black",
                                cursor: isViewOnly ? "default" : "pointer",
                              }}
                            >
                              {tc.status === "Fail" ? "X" : ""}
                            </button>
                          </div>
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "0 4px",
                            textAlign: "left",
                          }}
                        >
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
                            className="w-full bg-transparent focus:outline-none"
                            style={{ fontSize: "20px" }}
                          />
                        </td>
                        {!isViewOnly && (
                          <td style={{ padding: "0 0 0 4px", border: "none" }}>
                            <button
                              type="button"
                              onClick={() => removeTestCase(index)}
                              className="text-zinc-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginTop: "3px",
                    marginLeft: "16px",
                    fontStyle: "italic",
                  }}
                >
                  ** หมายเหตุ : สถานะ ✓ = ผ่าน / X = ไม่ผ่าน
                </div>
              </section>

              {/* ===== SECTION 3 ===== */}
              <section
                style={{
                  marginBottom: "20px",
                  fontFamily: "'Angsana New', sans-serif",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "24px",
                    marginBottom: "4px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <span>3.</span>
                  <span>ข้อเสนอแนะและผลทดสอบ</span>
                </div>
                <div style={{ paddingLeft: "20px" }}>
                  <textarea
                    name="testResultSummary"
                    value={formData.testResultSummary}
                    onChange={handleInputChange}
                    readOnly={isViewOnly}
                    rows={2}
                    className={getInputCls(
                      "testResultSummary",
                      "w-full resize-none leading-relaxed text-left",
                    )}
                    style={{
                      borderBottom: "1px dotted black",
                      minHeight: "44px",
                      fontSize: "18px",
                      lineHeight: "1.6",
                    }}
                  />
                </div>
              </section>

              {/* ===== SECTION 4 ===== */}
              <section
                style={{
                  marginBottom: "12px",
                  fontFamily: "'Angsana New', sans-serif",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "24px",
                    marginBottom: "4px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <span>4.</span>
                  <span>ผู้รับรองผลการทดสอบ</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid black",
                    margin: "0 auto",
                    width: "600px",
                    fontSize: "20px",
                  }}
                >
                  {/* ผู้ทดสอบ */}
                  <div
                    style={{
                      padding: "10px",
                      borderRight: "1px solid black",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "160px",
                      fontFamily: "'Angsana New', sans-serif",
                      fontSize: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginBottom: "8px",
                      }}
                    >
                      สำหรับผู้ทดสอบ :
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "auto",
                      }}
                    >
                      (ลงนาม) ผู้ทดสอบ
                    </div>
                    <div>
                      <div
                        style={{
                          textAlign: "center",
                          borderBottom: "1px dotted black",
                          minHeight: "20px",
                          marginBottom: "6px",
                          padding: "0 8px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>(</span>
                        <input
                          name="testerSignName"
                          value={formData.testerSignName}
                          onChange={handleInputChange}
                          readOnly={isViewOnly}
                          className={getInputCls(
                            "testerSignName",
                            "flex-1 !border-none",
                          )}
                        />
                        <span>)</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>วันที่</span>
                        <div className="w-[120px] relative flex items-center">
                          <input
                            type="date"
                            name="testerSignDate"
                            value={formData.testerSignDate}
                            onChange={handleInputChange}
                            readOnly={isViewOnly}
                            className={getInputCls(
                              "testerSignDate",
                              "w-full [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ผู้รับรอง */}
                  <div
                    style={{
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "160px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginBottom: "8px",
                      }}
                    >
                      สำหรับผู้รับรอง :
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "auto",
                      }}
                    >
                      (ลงนาม) ผู้บังคับบัญชา
                    </div>
                    <div>
                      <div
                        style={{
                          textAlign: "center",
                          borderBottom: "1px dotted black",
                          minHeight: "20px",
                          marginBottom: "6px",
                          padding: "0 8px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>(</span>
                        <input
                          name="approverSignName"
                          value={formData.approverSignName}
                          onChange={handleInputChange}
                          readOnly={isViewOnly}
                          className={getInputCls(
                            "approverSignName",
                            "flex-1 !border-none",
                          )}
                        />
                        <span>)</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>วันที่</span>
                        <div className="w-[120px] relative flex items-center">
                          <input
                            type="date"
                            name="approverSignDate"
                            value={formData.approverSignDate}
                            onChange={handleInputChange}
                            readOnly={isViewOnly}
                            className={getInputCls(
                              "approverSignDate",
                              "w-full [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ===== SECTION 5 ===== */}
              <section
                style={{
                  pageBreakInside: "avoid",
                  fontFamily: "'Angsana New', sans-serif",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "24px",
                    marginBottom: "4px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <span>5.</span>
                  <span>ผู้รับรองผลการทดสอบ</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    border: "1px solid black",
                    marginLeft: "20px",
                    fontSize: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      borderRight: "1px solid black",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "160px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginBottom: "6px",
                      }}
                    >
                      สำหรับผู้ดำเนินการ (Programmer) :
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "auto",
                      }}
                    >
                      (ลงนาม) ผู้พัฒนา
                    </div>
                    <div>
                      <div
                        style={{
                          textAlign: "center",
                          borderBottom: "1px dotted black",
                          minHeight: "18px",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>(</span>
                        <input
                          name="programmerSignName"
                          value={formData.programmerSignName}
                          onChange={handleInputChange}
                          readOnly={isViewOnly}
                          className={getInputCls(
                            "programmerSignName",
                            "flex-1 !border-none",
                          )}
                        />
                        <span>)</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>วันที่</span>
                        <div className="flex-1 relative flex items-center">
                          <input
                            type="date"
                            name="programmerSignDate"
                            value={formData.programmerSignDate}
                            onChange={handleInputChange}
                            readOnly={isViewOnly}
                            className={getInputCls(
                              "programmerSignDate",
                              "w-full [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Deploy */}
                  <div
                    style={{
                      padding: "8px",
                      borderRight: "1px solid black",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "160px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginBottom: "6px",
                      }}
                    >
                      สำหรับผู้ดำเนินการ (Deploy) :
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "auto",
                      }}
                    >
                      (ลงนาม) ผู้ Deploy
                    </div>
                    <div>
                      <div
                        style={{
                          textAlign: "center",
                          borderBottom: "1px dotted black",
                          minHeight: "18px",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>(</span>
                        <input
                          name="deployerSignName"
                          value={formData.deployerSignName}
                          onChange={handleInputChange}
                          readOnly={isViewOnly}
                          className={getInputCls(
                            "deployerSignName",
                            "flex-1 !border-none",
                          )}
                        />
                        <span>)</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>วันที่</span>
                        <div className="flex-1 relative flex items-center">
                          <input
                            type="date"
                            name="deployerSignDate"
                            value={formData.deployerSignDate}
                            onChange={handleInputChange}
                            readOnly={isViewOnly}
                            className={getInputCls(
                              "deployerSignDate",
                              "w-full [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Approver */}
                  <div
                    style={{
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "160px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginBottom: "6px",
                      }}
                    >
                      สำหรับผู้อนุมัติ :
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "auto",
                      }}
                    >
                      (ลงนาม) หัวหน้าทีม Application
                    </div>
                    <div>
                      <div
                        style={{
                          textAlign: "center",
                          borderBottom: "1px dotted black",
                          minHeight: "18px",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>(</span>
                        <input
                          name="appTeamLeadSignName"
                          value={formData.appTeamLeadSignName}
                          onChange={handleInputChange}
                          readOnly={isViewOnly}
                          className={getInputCls(
                            "appTeamLeadSignName",
                            "flex-1 !border-none",
                          )}
                        />
                        <span>)</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>วันที่</span>
                        <div className="flex-1 relative flex items-center">
                          <input
                            type="date"
                            name="appTeamLeadSignDate"
                            value={formData.appTeamLeadSignDate}
                            onChange={handleInputChange}
                            readOnly={isViewOnly}
                            className={getInputCls(
                              "appTeamLeadSignDate",
                              "w-full [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <span
              style={{
                fontStyle: "normal",
                fontSize: "17px",
              }}
            >
              FM-IT-14 : Rev 13/06/68
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UATForm;
