"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

// Force TypeScript to ignore model existence check by casting to any
const db = prisma as any;

export type UserRole = "DEV" | "QA" | "USER" | "ADMIN";

export async function seedInitialUser() {
  const existing = await db.user.findUnique({
    where: { username: "1736" },
  });

  if (!existing) {
    await db.user.create({
      data: {
        username: "1736",
        password: "17361736",
        name: "นายอานนท์ เกตุทัต",
        role: "DEV",
        staffId: "1736",
        department: "IT Development",
      },
    });
    return { success: true, message: "User seeded" };
  }
  return { success: true, message: "User already exists" };
}

export async function updateUserProfile(userId: string, data: any) {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data,
    });
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadSignature(userId: string, signatureBase64: string) {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { signatureUrl: signatureBase64 },
    });
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createUATDocument(data: any) {
  try {
    const { testCases, ...docData } = data;

    const result = await db.uATDocument.create({
      data: {
        ...docData,
        testCases: {
          create: testCases.map((tc: any) => ({
            tcNo: tc.tcNo,
            testCaseDetail: tc.testCaseDetail,
            status: tc.status,
            remark: tc.remark,
          })),
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating UAT record:", error);
    return { success: false, error: "Failed to create UAT record" };
  }
}

export async function getUATHistory() {
  try {
    const records = await db.uATDocument.findMany({
      orderBy: { createdAt: "desc" },
      include: { testCases: true },
    });
    return { success: true, data: records };
  } catch (error) {
    console.error("Error fetching UAT history:", error);
    return { success: false, error: "Failed to fetch UAT history" };
  }
}

export async function getUATById(id: string) {
  try {
    const record = await db.uATDocument.findUnique({
      where: { id },
      include: { testCases: true },
    });
    return { success: true, data: record };
  } catch (error) {
    console.error("Error fetching UAT record:", error);
    return { success: false, error: "Failed to fetch UAT record" };
  }
}

export async function updateUATDocument(id: string, data: any) {
  try {
    const { testCases, ...docData } = data;

    // First, delete existing test cases for this document
    await db.uATTestCase.deleteMany({
      where: { documentId: id },
    });

    // Then update the document and recreate test cases
    const result = await db.uATDocument.update({
      where: { id },
      data: {
        ...docData,
        testCases: {
          create: testCases.map((tc: any) => ({
            tcNo: tc.tcNo,
            testCaseDetail: tc.testCaseDetail,
            status: tc.status,
            remark: tc.remark,
          })),
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating UAT record:", error);
    return { success: false, error: "Failed to update UAT record" };
  }
}

export async function deleteUATDocument(id: string) {
  try {
    // cascade delete is handled by prisma schema (onDelete: Cascade)
    await db.uATDocument.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting UAT record:", error);
    return { success: false, error: "Failed to delete UAT record" };
  }
}

export async function getUATDashboardStats(year: number, month?: number) {
  try {
    // Determine the date range for the cards
    let startDate = new Date(year, 0, 1);
    let endDate = new Date(year + 1, 0, 1);

    if (month !== undefined && month !== null) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    }

    const records = await db.uATDocument.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    const total = records.length;
    const completed = records.filter(
      (r: any) => r.status === "Completed",
    ).length;
    const pending = records.filter((r: any) => r.status === "Pending").length;

    // Line chart data: number of completed UATs per month for the selected year
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      return {
        name: new Date(year, i, 1).toLocaleString("th-TH", { month: "short" }),
        count: 0,
      };
    });

    const yearRecords = await db.uATDocument.findMany({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
        status: "Completed",
      },
      select: { createdAt: true },
    });

    yearRecords.forEach((record: any) => {
      const recordMonth = record.createdAt.getMonth();
      monthlyData[recordMonth].count++;
    });

    return {
      success: true,
      data: {
        total,
        completed,
        pending,
        monthlyData,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

export async function updateUATStatus(id: string, status: string) {
  try {
    const result = await db.uATDocument.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating UAT status:", error);
    return { success: false, error: "Failed to update UAT status" };
  }
}

export async function getNotifications() {
  try {
    const pendingRecords = await db.uATDocument.findMany({
      where: { status: "Pending" },
      select: { id: true, docNo: true, projectName: true, createDate: true },
    });

    const now = new Date();
    const notifications = [];

    for (const record of pendingRecords) {
      const diffTime = Math.abs(
        now.getTime() - new Date(record.createDate).getTime(),
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 30) {
        notifications.push({ ...record, level: "red", days: diffDays });
      } else if (diffDays > 7) {
        notifications.push({ ...record, level: "yellow", days: diffDays });
      }
    }

    // Sort by days descending (oldest first)
    return {
      success: true,
      data: notifications.sort((a: any, b: any) => b.days - a.days),
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}
