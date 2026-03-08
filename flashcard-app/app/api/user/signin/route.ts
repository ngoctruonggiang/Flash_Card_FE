import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { signToken } from "@/src/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          message: "Missing email or password",
          data: null,
        },
        { status: 400 }
      );
    }

    const users = await db.users.findAll();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 401,
          timestamp: new Date().toISOString(),
          message: "Invalid credentials",
          data: null,
        },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    await db.users.save(users);

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      statusCode: 200,
      timestamp: new Date().toISOString(),
      message: "Login successful",
      data: {
        accessToken: token,
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
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
