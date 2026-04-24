"use client";

import React from "react";

interface UATPrintViewProps {
  data: any;
}

const UATPrintView = React.forwardRef<HTMLDivElement, UATPrintViewProps>(
  ({ data }, ref) => {
    if (!data) return null;

    const formatDate = (date: any) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const dots = (n = 40) => ".".repeat(n);

    return (
      <div
        ref={ref}
        className="bg-white text-black"
        style={{
          fontFamily: "'TH Sarabun New', 'Sarabun', sans-serif",
          fontSize: "13px",
          lineHeight: "1.4",
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* ===== HEADER ===== */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "relative",
              marginBottom: "18px",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "70px",
              }}
            >
              <img
                src="/logonew.png"
                alt="SC Group Logo"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                width: "100%",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                User Acceptance Test
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginTop: "2px",
                }}
              >
                แบบฟอร์มการรับรองการทดสอบระบบโดยผู้ใช้งาน
              </div>
            </div>

            <div style={{ fontWeight: "bold", fontSize: "13px" }}>UAT</div>
          </div>

          {/* ===== SECTION 1 ===== */}
          <section style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "3px",
                display: "flex",
                gap: "4px",
              }}
            >
              <span>1.</span>
              <span>ข้อมูลทั่วไปของโครงการ</span>
            </div>
            <div style={{ paddingLeft: "20px" }}>
              {/* ชื่อโครงการ */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "baseline",
                  marginBottom: "2px",
                }}
              >
                <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  ชื่อโครงการ
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted black",
                    minHeight: "18px",
                  }}
                >
                  {data.projectName || dots(80)}
                </span>
              </div>

              {/* Document Number / Create Date */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
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
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    Document Number
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                    }}
                  >
                    {data.docNo || dots(40)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    Create Date
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                      textAlign: "center",
                    }}
                  >
                    {data.createDate
                      ? formatDate(data.createDate)
                      : new Date().toLocaleDateString("th-TH")}
                  </span>
                </div>
              </div>

              {/* ผู้ทดสอบ / รหัสพนักงาน */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
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
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    ผู้ทดสอบ (UAT Tester)
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                    }}
                  >
                    {data.testerName || dots(30)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    รหัสพนักงาน
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                    }}
                  >
                    {data.staffId || dots(30)}
                  </span>
                </div>
              </div>

              {/* หน่วยงาน / เบอร์โทร */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
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
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    หน่วยงาน/แผนก
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                    }}
                  >
                    {data.department || dots(30)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    เบอร์โทร
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                    }}
                  >
                    {data.phone || dots(30)}
                  </span>
                </div>
              </div>

              {/* สถานที่ทดสอบ / วันที่ทดสอบ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
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
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    สถานที่ทดสอบ
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                    }}
                  >
                    {data.testLocation || dots(30)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    วันที่ทดสอบ
                  </span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "18px",
                      textAlign: "center",
                    }}
                  >
                    {data.testDate ? formatDate(data.testDate) : dots(25)}
                  </span>
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
                <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  เวอร์ชันระบบที่ทดสอบ
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted black",
                    minHeight: "18px",
                  }}
                >
                  {data.systemVersion || dots(70)}
                </span>
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
                <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  เอกสารอ้างอิง
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted black",
                    minHeight: "18px",
                  }}
                >
                  {data.referenceDoc || dots(75)}
                </span>
              </div>
            </div>
          </section>

          {/* ===== SECTION 2 ===== */}
          <section style={{ marginBottom: "12px" }}>
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
                  fontWeight: "bold",
                  fontSize: "14px",
                  display: "flex",
                  gap: "4px",
                }}
              >
                <span>2.</span>
                <span>รายละเอียด Test Case</span>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontStyle: "italic",
                  textDecoration: "underline",
                  paddingRight: "4px",
                }}
              >
                แนบเอกสารเพิ่มเติมหากมีขั้นตอนประกอบ
              </span>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
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
                </tr>
              </thead>
              <tbody>
                {Array.from({
                  length: Math.max(data.testCases?.length || 0, 5),
                }).map((_, i) => {
                  const tc = data.testCases?.[i];
                  return (
                    <tr key={i} style={{ height: "26px" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "2px 4px",
                        }}
                      >
                        {tc?.tcNo || ""}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "2px 4px",
                          textAlign: "left",
                        }}
                      >
                        {tc?.testCaseDetail || ""}
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
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              border: "1px solid black",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "bold",
                            }}
                          >
                            {tc?.status === "Pass"
                              ? "✓"
                              : tc?.status === "Fail"
                                ? "X"
                                : ""}
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "2px 4px",
                          textAlign: "left",
                        }}
                      >
                        {tc?.remark || ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              style={{
                fontSize: "10px",
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
          <section style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "3px",
                display: "flex",
                gap: "4px",
              }}
            >
              <span>3.</span>
              <span>ข้อเสนอแนะและผลทดสอบ</span>
            </div>
            <div style={{ paddingLeft: "20px" }}>
              <div
                style={{
                  borderBottom: "1px dotted black",
                  minHeight: "22px",
                  paddingBottom: "2px",
                  marginBottom: "6px",
                  fontSize: "13px",
                }}
              >
                {data.testResultSummary || dots(100)}
              </div>
              <div
                style={{ borderBottom: "1px dotted black", minHeight: "22px" }}
              ></div>
            </div>
          </section>

          {/* ===== SECTION 4 ===== */}
          <section style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "3px",
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
                gap: "16px",
                paddingLeft: "20px",
              }}
            >
              {/* ผู้ทดสอบ */}
              <div style={{ border: "1px solid black", padding: "10px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    textDecoration: "underline",
                    marginBottom: "8px",
                  }}
                >
                  สำหรับผู้ทดสอบ :
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    marginBottom: "24px",
                  }}
                >
                  (ลงนาม) ผู้ทดสอบ
                </div>
                <div
                  style={{
                    textAlign: "center",
                    borderBottom: "1px dotted black",
                    minHeight: "20px",
                    fontSize: "12px",
                    marginBottom: "6px",
                    padding: "0 8px",
                  }}
                >
                  {data.testerSignName
                    ? `(${data.testerSignName})`
                    : `(${dots(35)})`}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "12px",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>วันที่</span>
                  <span
                    style={{
                      borderBottom: "1px dotted black",
                      flex: 1,
                      maxWidth: "120px",
                      textAlign: "center",
                      minHeight: "18px",
                    }}
                  >
                    {data.testerSignDate
                      ? formatDate(data.testerSignDate)
                      : dots(20)}
                  </span>
                </div>
              </div>

              {/* ผู้รับรอง */}
              <div style={{ border: "1px solid black", padding: "10px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    textDecoration: "underline",
                    marginBottom: "8px",
                  }}
                >
                  สำหรับผู้รับรอง :
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    marginBottom: "24px",
                  }}
                >
                  (ลงนาม) ผู้บังคับบัญชา
                </div>
                <div
                  style={{
                    textAlign: "center",
                    borderBottom: "1px dotted black",
                    minHeight: "20px",
                    fontSize: "12px",
                    marginBottom: "6px",
                    padding: "0 8px",
                  }}
                >
                  {data.approverSignName
                    ? `(${data.approverSignName})`
                    : `(${dots(35)})`}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "12px",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>วันที่</span>
                  <span
                    style={{
                      borderBottom: "1px dotted black",
                      flex: 1,
                      maxWidth: "120px",
                      textAlign: "center",
                      minHeight: "18px",
                    }}
                  >
                    {data.approverSignDate
                      ? formatDate(data.approverSignDate)
                      : dots(20)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 5 ===== */}
          <section style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "3px",
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
              }}
            >
              {/* Programmer */}
              <div
                style={{
                  padding: "8px",
                  borderRight: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "120px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "10px",
                    textDecoration: "underline",
                    marginBottom: "6px",
                  }}
                >
                  สำหรับผู้ดำเนินการ (Programmer) :
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    fontStyle: "italic",
                    marginBottom: "auto",
                    paddingBottom: "8px",
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
                      fontSize: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    {data.programmerSignName
                      ? `(${data.programmerSignName})`
                      : `(${dots(30)})`}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      fontSize: "10px",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>วันที่</span>
                    <span
                      style={{
                        borderBottom: "1px dotted black",
                        flex: 1,
                        textAlign: "center",
                        minHeight: "16px",
                      }}
                    >
                      {data.programmerSignDate
                        ? formatDate(data.programmerSignDate)
                        : dots(18)}
                    </span>
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
                  minHeight: "120px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "10px",
                    textDecoration: "underline",
                    marginBottom: "6px",
                  }}
                >
                  สำหรับผู้ดำเนินการ (Deploy) :
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    fontStyle: "italic",
                    marginBottom: "auto",
                    paddingBottom: "8px",
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
                      fontSize: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    {data.deployerSignName
                      ? `(${data.deployerSignName})`
                      : `(${dots(30)})`}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      fontSize: "10px",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>วันที่</span>
                    <span
                      style={{
                        borderBottom: "1px dotted black",
                        flex: 1,
                        textAlign: "center",
                        minHeight: "16px",
                      }}
                    >
                      {data.deployerSignDate
                        ? formatDate(data.deployerSignDate)
                        : dots(18)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Approver */}
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "120px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "10px",
                    textDecoration: "underline",
                    marginBottom: "6px",
                  }}
                >
                  สำหรับผู้อนุมัติ :
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    fontStyle: "italic",
                    marginBottom: "auto",
                    paddingBottom: "8px",
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
                      fontSize: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    {data.appTeamLeadSignName
                      ? `(${data.appTeamLeadSignName})`
                      : `(${dots(30)})`}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      fontSize: "10px",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>วันที่</span>
                    <span
                      style={{
                        borderBottom: "1px dotted black",
                        flex: 1,
                        textAlign: "center",
                        minHeight: "16px",
                      }}
                    >
                      {data.appTeamLeadSignDate
                        ? formatDate(data.appTeamLeadSignDate)
                        : dots(18)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== FOOTER ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "12px",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "11px" }}>
            FM-IT-14 : Rev 13/06/68
          </span>
        </div>
      </div>
    );
  },
);

UATPrintView.displayName = "UATPrintView";

export default UATPrintView;
