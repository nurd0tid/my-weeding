import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "app/data.json");

export async function POST(req: NextRequest) {
  const { name, attendance, message } = await req.json();
  const newEntry = {
    name,
    attendance: attendance.name, // Pastikan kita mengambil name dari attendance
    message,
    timestamp: new Date().toISOString(),
  };

  // Baca data yang ada
  let jsonData = [];
  try {
    const fileData = fs.readFileSync(dataPath, "utf8");
    if (fileData) {
      jsonData = JSON.parse(fileData);
    }
  } catch (error: unknown) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      // File tidak ada, buat file baru
      fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
    } else {
      throw error;
    }
  }

  // Tambahkan data baru
  jsonData.push(newEntry);

  // Tulis kembali ke file
  fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2));

  return NextResponse.json({ message: "Data submitted successfully" });
}

export async function GET() {
  let jsonData = [];
  try {
    const fileData = fs.readFileSync(dataPath, "utf8");
    if (fileData) {
      jsonData = JSON.parse(fileData);
    }
  } catch (error: unknown) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      // File tidak ada, buat file baru
      fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
    } else {
      throw error;
    }
  }
  return NextResponse.json(jsonData);
}
