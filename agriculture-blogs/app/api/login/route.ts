import ConnectDB from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await ConnectDB();

    // 2. User ko dhoondna
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" }, // Security ke liye generic message
        { status: 401 }
      );
    }

    // 3. Bcrypt se password check karna
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Add role field if it doesn't exist
    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user  
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}