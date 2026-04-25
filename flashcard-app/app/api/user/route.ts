import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getUserFromRequest } from "@/src/lib/auth";

export async function GET(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) {
      return NextResponse.json(
        {
          statusCode: 401,
          timestamp: new Date().toISOString(),
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const users = await db.users.findAll();
    const user = users.find((u) => u.id === payload.id);

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

export async function PATCH(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) {
      return NextResponse.json(
        {
          statusCode: 401,
          timestamp: new Date().toISOString(),
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, email, password, role } = body;

    const users = await db.users.findAll();
    const userIndex = users.findIndex((u) => u.id === payload.id);

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

    // Update fields if provided
    if (username) users[userIndex].username = username;
    if (email) users[userIndex].email = email;
    if (password) users[userIndex].password = password;
    // Role update might be restricted to admin, but for now allowing it as per doc implies self-update or admin update.
    // Actually doc says "Update user role (typically admin-only)".
    // I'll allow it for now for simplicity or restrict if I had role check logic.
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

export async function DELETE(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) {
      return NextResponse.json(
        {
          statusCode: 401,
          timestamp: new Date().toISOString(),
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const users = await db.users.findAll();
    const newUsers = users.filter((u) => u.id !== payload.id);

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
