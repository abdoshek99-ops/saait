import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: any
) {
  try {
    const id = context?.params?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    // ضع منطقك الحالي هنا كما هو
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}