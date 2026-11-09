import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RegisteredDevice {
  id: string;
  name: string;
  first_seen?: string;
  last_active?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey, toolName, deviceId, deviceName } = body;

    if (!apiKey) {
      return NextResponse.json(
        { 
          authorized: false, 
          error: "Missing API Key", 
          message: "กรุณาระบุ AIFULLFILL_API_KEY ในการเรียกใช้งานระบบ" 
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

    // 1. ตรวจสอบ API Key ในตาราง user_api_keys พร้อมฟิลด์ devices และ allowed_tools
    const { data: keyData, error: keyError } = await supabase
      .from("user_api_keys")
      .select("id, user_id, is_active, name, max_devices, devices, allowed_tools")
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

    // 2. ตรวจสอบสิทธิ์รายเครื่องมือ (Tool Entitlements) หากมีการกำหนดไว้
    if (toolName && keyData.allowed_tools && Array.isArray(keyData.allowed_tools) && keyData.allowed_tools.length > 0) {
      if (!keyData.allowed_tools.includes(toolName)) {
        return NextResponse.json(
          {
            authorized: false,
            error: "Tool Not Allowed",
            message: `แพ็กเกจหรือคีย์ของคุณยังไม่ได้รับสิทธิ์ใช้งานเครื่องมือ [${toolName}] กรุณาติดต่อแอดมินหรืออัปเกรดแพ็กเกจ`,
          },
          { status: 403 }
        );
      }
    }

    // 3. ตรวจสอบสถานะสมาชิกในตาราง user_subscriptions หรือเป็น Admin ใน profiles
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

    // 4. ตรวจสอบและบันทึก Device Lock (ปรับแต่ง max_devices อิสระเป็นรายบุคคล)
    const maxDevices = keyData.max_devices ?? 2;
    let devices = (keyData.devices as RegisteredDevice[]) || [];
    let currentDeviceRegistered = false;

    if (deviceId) {
      const cleanDevId = String(deviceId).trim();
      const cleanDevName = deviceName ? String(deviceName).trim() : `Device-${cleanDevId.substring(0, 8)}`;
      const existingIdx = devices.findIndex((d) => d.id === cleanDevId);

      if (existingIdx !== -1) {
        // เครื่องเดิมที่เคยลงทะเบียนแล้ว: อัปเดตเวลาใช้งานล่าสุด
        devices[existingIdx].last_active = new Date().toISOString();
        if (deviceName) devices[existingIdx].name = cleanDevName;
        currentDeviceRegistered = true;
      } else {
        // เครื่องใหม่: ตรวจสอบว่าเกินโควตา max_devices หรือไม่
        if (devices.length >= maxDevices) {
          const registeredList = devices.map((d) => d.name || d.id).join(", ");
          return NextResponse.json(
            {
              authorized: false,
              error: "Device Limit Exceeded",
              message: `อุปกรณ์ของคุณเกินโควตาที่ได้รับอนุญาต (${devices.length}/${maxDevices} เครื่อง: ${registeredList}) หากคุณเปลี่ยนเครื่อง กรุณาติดต่อแอดมินหรือรีเซ็ตอุปกรณ์ที่ aifullfill.com/dashboard`,
              devicesUsed: devices.length,
              maxDevices: maxDevices,
            },
            { status: 403 }
          );
        }

        // ยังไม่เกินโควตา: ลงทะเบียนเครื่องใหม่
        devices.push({
          id: cleanDevId,
          name: cleanDevName,
          first_seen: new Date().toISOString(),
          last_active: new Date().toISOString(),
        });
        currentDeviceRegistered = true;
      }
    }

    // 5. บันทึกข้อมูล devices และ last_used_at กลับสู่ฐานข้อมูล Supabase
    await supabase
      .from("user_api_keys")
      .update({
        last_used_at: new Date().toISOString(),
        devices: devices,
      })
      .eq("id", keyData.id);

    return NextResponse.json({
      authorized: true,
      message: "สิทธิ์ถูกต้อง อนุญาตให้ใช้งานได้",
      tier: isAdmin ? "admin" : subscription?.tier,
      expiresAt: isAdmin ? "lifetime" : subscription?.current_period_end,
      toolRequested: toolName || "unknown",
      device: deviceId
        ? {
            id: deviceId,
            registered: currentDeviceRegistered,
            devicesUsed: devices.length,
            maxDevices: maxDevices,
          }
        : null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { authorized: false, error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
