import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const body = await request.json();
    const { keyId, action, maxDevices } = body;

    if (!keyId || !action) {
      return NextResponse.json({ error: "ต้องระบุ keyId และ action (reset | update_max)" }, { status: 400 });
    }

    if (action === "reset") {
      // รีเซ็ตอุปกรณ์ทั้งหมดให้เป็นอาเรย์ว่าง
      const { error } = await supabase
        .from("user_api_keys")
        .update({ devices: [] })
        .eq("id", keyId);

      if (error) throw error;

      return NextResponse.json({ success: true, message: "ล้างรายการอุปกรณ์ที่ผูกไว้เรียบร้อยแล้ว ผู้ใช้สามารถนำคีย์ไปผูกกับคอมพิวเตอร์เครื่องใหม่ได้ทันที" });
    } else if (action === "update_max") {
      const num = parseInt(maxDevices, 10);
      if (isNaN(num) || num < 1 || num > 50) {
        return NextResponse.json({ error: "จำนวนอุปกรณ์ต้องเป็นตัวเลขระหว่าง 1 ถึง 50" }, { status: 400 });
      }

      const { error } = await supabase
        .from("user_api_keys")
        .update({ max_devices: num })
        .eq("id", keyId);

      if (error) throw error;

      return NextResponse.json({ success: true, message: `อัปเดตโควตาจำนวนเครื่องสูงสุดเป็น ${num} เครื่องเรียบร้อยแล้ว` });
    } else {
      return NextResponse.json({ error: "คำสั่ง action ไม่ถูกต้อง (reset | update_max)" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Admin Manage Devices Error:", err);
    return NextResponse.json({ error: err.message || "Failed to manage devices" }, { status: 500 });
  }
}
