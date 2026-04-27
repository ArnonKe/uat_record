"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function createUATDocument(data: any) {
  try {
    const { testCases, ...docData } = data;
    
    const result = await prisma.uATDocument.create({
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
    const records = await prisma.uATDocument.findMany({
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
    const record = await prisma.uATDocument.findUnique({
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
    await prisma.uATTestCase.deleteMany({
      where: { documentId: id }
    });

    // Then update the document and recreate test cases
    const result = await prisma.uATDocument.update({
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
    await prisma.uATDocument.delete({
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

    const records = await prisma.uATDocument.findMany({
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
    const completed = records.filter(r => r.status === "Completed").length;
    const pending = records.filter(r => r.status === "Pending").length;

    // Line chart data: number of completed UATs per month for the selected year
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      return {
        name: new Date(year, i, 1).toLocaleString("th-TH", { month: "short" }),
        count: 0,
      };
    });

    const yearRecords = await prisma.uATDocument.findMany({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
        status: "Completed",
      },
      select: { createdAt: true }
    });

    yearRecords.forEach(record => {
      const recordMonth = record.createdAt.getMonth();
      monthlyData[recordMonth].count++;
    });

    return {
      success: true,
      data: {
        total,
        completed,
        pending,
        monthlyData
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

export async function updateUATStatus(id: string, status: string) {
  try {
    const result = await prisma.uATDocument.update({
      where: { id },
      data: { status }
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
    const pendingRecords = await prisma.uATDocument.findMany({
      where: { status: "Pending" },
      select: { id: true, docNo: true, projectName: true, createDate: true }
    });

    const now = new Date();
    const notifications = [];

    for (const record of pendingRecords) {
      const diffTime = Math.abs(now.getTime() - new Date(record.createDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 30) {
        notifications.push({ ...record, level: "red", days: diffDays });
      } else if (diffDays > 7) {
        notifications.push({ ...record, level: "yellow", days: diffDays });
      }
    }

    // Sort by days descending (oldest first)
    return { success: true, data: notifications.sort((a, b) => b.days - a.days) };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

