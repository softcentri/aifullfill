import { createClient } from "@/utils/supabase/server";

export interface AdminAuthResult {
  isAdmin: boolean;
  user: any | null;
  profile: any | null;
  supabase: any;
  error?: string;
}

/**
 * ตรวจสอบสิทธิ์ว่าผู้เรียกใช้งานเป็น Admin หรือไม่
 */
export async function verifyAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      isAdmin: false,
      user: null,
      profile: null,
      supabase,
      error: "กรุณาเข้าสู่ระบบก่อนเข้าใช้งาน",
    };
  }

  // ดึงโปรไฟล์เพื่อเช็ค role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return {
      isAdmin: false,
      user,
      profile,
      supabase,
      error: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (เฉพาะผู้ดูแลระบบเท่านั้น)",
    };
  }

  return {
    isAdmin: true,
    user,
    profile,
    supabase,
  };
}
