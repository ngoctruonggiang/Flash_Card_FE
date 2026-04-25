import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getUserFromRequest } from "@/src/lib/auth";

export async function GET(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json(
        {
          statusCode: 403,
          timestamp: new Date().toISOString(),
          message: "Forbidden: Admin access required",
          data: null,
        },
        { status: 403 }
      );
    }

    const users = await db.users.findAll();
    const usersWithoutPassword = users.map(({ password, ...u }) => u);

    return NextResponse.json({
      statusCode: 200,
      timestamp: new Date().toISOString(),
      message: "Users retrieved successfully",
      data: usersWithoutPassword,
    });
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
