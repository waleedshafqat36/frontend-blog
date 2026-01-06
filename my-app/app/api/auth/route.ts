import ConnectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";



export async function POST(request: Request) {
try {
    const {name,email,password} = await request.json();
    if (!name || !email || !password) {
        return NextResponse.json({message: "All fields (name, email, password) are required", success:false}, { status: 400 });
    }
    await ConnectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name, email, password: hashedPassword });
    return NextResponse.json({ message: "User registered successfully", success:true, user: newUser }, { status: 201 });
} catch (error) {
    console.error("Signup Page Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

    