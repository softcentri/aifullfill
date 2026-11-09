import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API Key", message: "กรุณาระบุ apiKey" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    // ค้นหา API Key
    const { data: keyData, error } = await supabase
      .from("user_api_keys")
      .select("id, user_id, is_active")
      .eq("key_hash", apiKey)
      .single();

    if (error || !keyData || !keyData.is_active) {
      return NextResponse.json(
        { error: "Invalid Key", message: "ไม่พบคีย์หรือคีย์ถูกระงับสิทธิ์" },
        { status: 403 }
      );
    }

    // ล้างรายชื่ออุปกรณ์ที่ผูกไว้ทั้งหมด (Reset Devices)
    await supabase
      .from("user_api_keys")
      .update({ devices: [] })
      .eq("id", keyData.id);

    return NextResponse.json({
      success: true,
      message: "รีเซ็ตรายชื่ออุปกรณ์สำเร็จแล้ว สามารถนำคีย์ไปลงทะเบียนบนเครื่องใหม่ได้ทันที",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server Error", message: err.message },
      { status: 500 }
    );
  }
}
