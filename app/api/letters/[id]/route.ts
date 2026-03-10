import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the letter
    const letter = await prisma.letter.findUnique({
      where: { id },
    });

    if (!letter) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    if (letter.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Not your letter" }, { status: 403 });
    }

    if (letter.status !== "DELIVERED") {
      return NextResponse.json(
        { error: "Letter cannot be opened yet" },
        { status: 400 }
      );
    }

    // Mark as opened
    const updated = await prisma.letter.update({
      where: { id },
      data: {
        status: "OPENED",
        openedAt: new Date(),
      },
    });

    return NextResponse.json({ letter: updated });
  } catch (error) {
    console.error("Open letter error:", error);
    return NextResponse.json(
      { error: "Failed to open letter" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const letter = await prisma.letter.findUnique({
      where: { id },
      include: {
        sender: { select: { name: true, city: true, country: true } },
        receiver: { select: { name: true, city: true, country: true } },
      },
    });

    if (!letter) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    // Only sender or receiver can view
    if (letter.senderId !== session.user.id && letter.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("Get letter error:", error);
    return NextResponse.json(
      { error: "Failed to fetch letter" },
      { status: 500 }
    );
  }
}
