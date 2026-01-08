import ConnectDB from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB();
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return NextResponse.json({ success: true, users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }  
}
