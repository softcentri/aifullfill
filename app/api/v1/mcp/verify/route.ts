import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey, toolName } = body;

    if (!apiKey) {
      return NextResponse.json(
        { 
          authorized: false, 
          error: "Missing API Key", 
          message: "กรุณาระบุ AIFULLFILL_API_KEY ในการเรียกใช้งาน MCP Server" 
        },
        { status: 401 }
      );
    }

    // สร้าง Supabase Server Client
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

    // 1. ตรวจสอบ API Key ในตาราง user_api_keys
    const { data: keyData, error: keyError } = await supabase
      .from("user_api_keys")
      .select("id, user_id, is_active, name")
      .eq("key_hash", apiKey)
      .single();

    if (keyError || !keyData || !keyData.is_active) {
      return NextResponse.json(
        {
          authorized: false,
          error: "Invalid or Revoked API Key",
          message: "API Key นี้ไม่ถูกต้องหรือถูกเพิกถอนสิทธิ์แล้ว กรุณาสร้างคีย์ใหม่ที่ aifullfill.com/dashboard",
        },
        { status: 403 }
      );
    }

    // 2. ตรวจสอบสถานะสมาชิกในตาราง user_subscriptions หรือเป็น Admin ใน profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", keyData.user_id)
      .single();

    const isAdmin = profile?.role === "admin";

    // ตรวจสอบ Subscription Active
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("tier, status, current_period_end")
      .eq("user_id", keyData.user_id)
      .eq("status", "active")
      .gt("current_period_end", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!isAdmin && !subscription) {
      return NextResponse.json(
        {
          authorized: false,
          error: "Subscription Expired",
          message: "แพ็กเกจสมาชิกบุฟเฟต์ของคุณหมดอายุแล้ว กรุณาต่ออายุสมาชิกที่ aifullfill.com เพื่อใช้งานเครื่องมือต่อ",
        },
        { status: 403 }
      );
    }

    // 3. บันทึกเวลาใช้งานล่าสุด last_used_at
    await supabase
      .from("user_api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyData.id);

    return NextResponse.json({
      authorized: true,
      message: "สิทธิ์ถูกต้อง อนุญาตให้ MCP ทำงานได้",
      tier: isAdmin ? "admin" : subscription?.tier,
      expiresAt: isAdmin ? "lifetime" : subscription?.current_period_end,
      toolRequested: toolName || "unknown",
    });
  } catch (err: any) {
    return NextResponse.json(
      { authorized: false, error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
