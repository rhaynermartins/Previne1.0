import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const healthCheck = await prisma.healthCheck.findFirst({
      orderBy: {
        checkedAt: "desc",
      },
    });

    return NextResponse.json({
      status: "ok",
      database: "connected",
      healthCheck,
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        database: "unavailable",
      },
      { status: 503 },
    );
  }
}
