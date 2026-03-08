import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { signToken } from "@/src/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, confirmPassword } = body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          message: "Missing required fields",
          data: null,
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          statusCode: 400,
          timestamp: new Date().toISOString(),
          message: "Passwords do not match",
          data: null,
        },
        { status: 400 }
      );
    }

    const users = await db.users.findAll();

    if (users.some((u) => u.email === email || u.username === username)) {
      return NextResponse.json(
        {
          statusCode: 409,
          timestamp: new Date().toISOString(),
          message: "User already exists",
          data: null,
        },
        { status: 409 }
      );
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password, // In a real app, hash this!
      role: "USER",
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };

    users.push(newUser);
    await db.users.save(users);

    const token = await signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json({
      statusCode: 201,
      timestamp: new Date().toISOString(),
      message: "User registered successfully",
      data: {
        accessToken: token,
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        lastLoginAt: newUser.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
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
