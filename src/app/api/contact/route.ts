import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

function ensureDataDir() {
  const dir = path.dirname(LEADS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, "[]");
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, interest, message } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 }
      );
    }

    ensureDataDir();

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));

    leads.push({
      name,
      email,
      phone: phone || "",
      interest: interest || "",
      message: message || "",
      date: new Date().toISOString(),
      status: "new",
    });

    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    // TODO: Add Resend email notification here when API key is configured
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    return NextResponse.json({ message: "Mensaje recibido" });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
