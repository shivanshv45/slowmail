import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateDeliveryEta } from "@/lib/delivery";

const DAILY_LETTER_LIMIT = 3;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientEmail, content, signOff, receiverCity, stationeryStyle, scheduledDate } = await request.json();

    if (!recipientEmail || !content || !receiverCity) {
      return NextResponse.json(
        { error: "Recipient email, content, and receiver city are required" },
        { status: 400 }
      );
    }

    // Find recipient
    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found. They need to create an account first." },
        { status: 404 }
      );
    }

    if (recipient.id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot send a letter to yourself" },
        { status: 400 }
      );
    }

    // Get sender info
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Check daily limit
    const today = new Date().toISOString().split("T")[0];
    if (sender.lastLetterDate === today && sender.dailyLetterCount >= DAILY_LETTER_LIMIT) {
      return NextResponse.json(
        { error: `You've reached your daily limit of ${DAILY_LETTER_LIMIT} letters. Come back tomorrow!` },
        { status: 429 }
      );
    }

    // Calculate delivery ETA
    const senderCity = sender.city || "Unknown";
    const deliveryEta = scheduledDate
      ? new Date(scheduledDate)
      : calculateDeliveryEta(senderCity, receiverCity);

    // Create letter
    const letter = await prisma.letter.create({
      data: {
        content,
        senderCity,
        receiverCity,
        senderName: sender.name,
        signOff: signOff || "",
        status: "IN_TRANSIT",
        deliveryEta,
        stationeryStyle: stationeryStyle || "classic-cream",
        isFutureLetter: !!scheduledDate,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        senderId: session.user.id,
        receiverId: recipient.id,
      },
    });

    // Update daily letter count
    const newCount = sender.lastLetterDate === today ? sender.dailyLetterCount + 1 : 1;
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dailyLetterCount: newCount,
        lastLetterDate: today,
      },
    });

    return NextResponse.json(
      {
        message: "Letter sent!",
        letter: {
          id: letter.id,
          deliveryEta: letter.deliveryEta,
          receiverCity: letter.receiverCity,
          senderCity: letter.senderCity,
        },
        remainingLetters: DAILY_LETTER_LIMIT - newCount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send letter error:", error);
    return NextResponse.json(
      { error: "Failed to send letter" },
      { status: 500 }
    );
  }
}
