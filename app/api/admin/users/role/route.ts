import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase, user } = auth;

  try {
    const body = await request.json();
    const { targetUserId, newRole } = body;

    if (!targetUserId || !["user", "admin"].includes(newRole)) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง (ต้องระบุ targetUserId และ newRole: user | admin)" }, { status: 400 });
    }

    // ป้องกันแอดมินปลดสิทธิ์ตัวเองจนไม่เหลือแอดมิน
    if (targetUserId === user.id && newRole === "user") {
      return NextResponse.json({ error: "คุณไม่สามารถลดระดับสิทธิ์ของตัวเองได้" }, { status: 400 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("user_id", targetUserId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: `เปลี่ยนบทบาทเป็น ${newRole} สำเร็จ` });
  } catch (err: any) {
    console.error("Admin Update Role Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update role" }, { status: 500 });
  }
}
