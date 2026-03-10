import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        isPublic: true,
        id: { not: session.user.id },
      },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            sentLetters: true,
            receivedLetters: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Discover error:", error);
    return NextResponse.json(
      { error: "Failed to fetch writers" },
      { status: 500 }
    );
  }
}
