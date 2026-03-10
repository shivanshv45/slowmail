import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Auto-deliver letters whose ETA has passed
    await prisma.letter.updateMany({
      where: {
        receiverId: session.user.id,
        status: "IN_TRANSIT",
        deliveryEta: { lte: now },
      },
      data: {
        status: "DELIVERED",
        deliveredAt: now,
      },
    });

    // Fetch all received letters
    const letters = await prisma.letter.findMany({
      where: {
        receiverId: session.user.id,
      },
      orderBy: [
        { status: "asc" }, // DELIVERED first, then IN_TRANSIT, then OPENED
        { deliveryEta: "desc" },
      ],
      include: {
        sender: {
          select: { name: true, city: true, country: true },
        },
      },
    });

    return NextResponse.json({ letters });
  } catch (error) {
    console.error("Inbox fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inbox" },
      { status: 500 }
    );
  }
}
