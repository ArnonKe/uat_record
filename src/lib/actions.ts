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

