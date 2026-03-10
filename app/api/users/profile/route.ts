import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        country: true,
        bio: true,
        isPublic: true,
        onboarded: true,
        createdAt: true,
        _count: {
          select: {
            sentLetters: true,
            receivedLetters: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get daily letter info
    const today = new Date().toISOString().split("T")[0];
    const senderInfo = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dailyLetterCount: true, lastLetterDate: true },
    });

    const remainingLetters = senderInfo?.lastLetterDate === today
      ? Math.max(0, 3 - (senderInfo?.dailyLetterCount || 0))
      : 3;

    return NextResponse.json({ user, remainingLetters });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, city, country, bio, isPublic, onboarded } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (bio !== undefined) updateData.bio = bio;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (onboarded !== undefined) updateData.onboarded = onboarded;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        country: true,
        bio: true,
        isPublic: true,
        onboarded: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
