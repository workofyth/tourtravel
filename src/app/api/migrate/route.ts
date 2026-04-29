import { migrateImagesToBlob } from "@/lib/actions/migration";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await migrateImagesToBlob();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
