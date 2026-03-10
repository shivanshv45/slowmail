import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const letters = await prisma.letter.findMany({
      where: {
        senderId: session.user.id,
      },
      orderBy: { dispatchedAt: "desc" },
      include: {
        receiver: {
          select: { name: true, city: true, country: true },
        },
      },
    });

    return NextResponse.json({ letters });
  } catch (error) {
    console.error("Sent letters fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sent letters" },
      { status: 500 }
    );
  }
}
