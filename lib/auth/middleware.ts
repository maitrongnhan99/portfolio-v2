import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  
  return session;
}

export async function getAuthSession() {
  return await getServerSession(authOptions);
}