import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getUserFromRequest } from "@/src/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const userId = parseInt(id);
    const users = await db.users.findAll();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 404,
          timestamp: new Date().toISOString(),
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      statusCode: 200,
      timestamp: new Date().toISOString(),
      message: "User retrieved successfully",
      data: userWithoutPassword,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();
    const { username, email, password, role } = body;

    const users = await db.users.findAll();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          statusCode: 404,
          timestamp: new Date().toISOString(),
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    if (username) users[userIndex].username = username;
    if (email) users[userIndex].email = email;
    if (password) users[userIndex].password = password;
    if (role) users[userIndex].role = role;

    await db.users.save(users);

    const { password: _, ...updatedUser } = users[userIndex];

    return NextResponse.json({
      statusCode: 200,
      timestamp: new Date().toISOString(),
      message: "User updated successfully",
      data: updatedUser,
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const userId = parseInt(id);
    const users = await db.users.findAll();
    const newUsers = users.filter((u) => u.id !== userId);

    if (users.length === newUsers.length) {
      return NextResponse.json(
        {
          statusCode: 404,
          timestamp: new Date().toISOString(),
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    await db.users.save(newUsers);

    return NextResponse.json({
      statusCode: 200,
      timestamp: new Date().toISOString(),
      message: "User deleted successfully",
      data: null,
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
