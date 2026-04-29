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
          fontFamily:
            "'Times New Roman', 'TH Sarabun New', 'Sarabun', sans-serif",
          fontSize: "16px",
          lineHeight: "1.0",
          width: "210mm",
          padding: "3mm",
          paddingTop: "0mm",
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
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted black",
                    minHeight: "20px",
                  }}
                >
                  {data.projectName || ""}
                </span>
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
                    }}
                  >
                    {data.docNo || ""}
                  </span>
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
                    }}
                  >
                    {data.testerName || ""}
                  </span>
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
                    }}
                  >
                    {data.staffId || ""}
                  </span>
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
                    }}
                  >
                    {data.department || ""}
                  </span>
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
                    }}
                  >
                    {data.phone || ""}
                  </span>
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
                    }}
                  >
                    {data.testLocation || ""}
                  </span>
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
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px dotted black",
                      minHeight: "20px",
                      textAlign: "center",
                    }}
                  >
                    {data.testDate ? formatDate(data.testDate) : ""}
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
                <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                  เวอร์ชันระบบที่ทดสอบ
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted black",
                    minHeight: "20px",
                  }}
                >
                  {data.systemVersion || ""}
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
                <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                  เอกสารอ้างอิง
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted black",
                    minHeight: "20px",
                  }}
                >
                  {data.referenceDoc || ""}
                </span>
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
                </tr>
              </thead>
              <tbody>
                {Array.from({
                  length: Math.max(data.testCases?.length || 0, 5),
                }).map((_, i) => {
                  const tc = data.testCases?.[i];
                  return (
                    <tr key={i} style={{ height: "22px" }}>
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
                              fontSize: "15px",
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
              <div
                style={{
                  borderBottom: "1px dotted black",
                  minHeight: "22px",
                  paddingBottom: "2px",
                  marginBottom: "6px",
                  fontSize: "18px",
                  lineHeight: "1.6",
                }}
              >
                {data.testResultSummary || ""}
              </div>
              <div
                style={{ borderBottom: "1px dotted black", minHeight: "22px" }}
              ></div>
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
                    }}
                  >
                    {data.testerSignName ? `(${data.testerSignName})` : ""}
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
                        : ""}
                    </span>
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
                    }}
                  >
                    {data.approverSignName ? `(${data.approverSignName})` : ""}
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
                        : ""}
                    </span>
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: "16px" }}>(ลงนาม) ผู้พัฒนา</div>
                  {data.programmerSignatureUrl && (
                    <div style={{ height: "40px", marginTop: "-10px", marginBottom: "-10px" }}>
                      <img 
                        src={data.programmerSignatureUrl} 
                        alt="signature" 
                        style={{ maxHeight: "100%", maxWidth: "150px", objectFit: "contain" }} 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      borderBottom: "1px dotted black",
                      minHeight: "18px",

                      marginBottom: "4px",
                    }}
                  >
                    {data.programmerSignName
                      ? `(${data.programmerSignName})`
                      : ""}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",

                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>วันที่</span>
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
                        : ""}
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
                    }}
                  >
                    {data.deployerSignName ? `(${data.deployerSignName})` : ""}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>วันที่</span>
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
                        : ""}
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
                    }}
                  >
                    {data.appTeamLeadSignName
                      ? `(${data.appTeamLeadSignName})`
                      : ""}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>วันที่</span>
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
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>{" "}
          </section>{" "}
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
              fontSize: "20px",
            }}
          >
            FM-IT-14 : Rev 13/06/68
          </span>
        </div>
      </div>
    );
  },
);

UATPrintView.displayName = "UATPrintView";

export default UATPrintView;
