import bcrypt from "bcryptjs"
import {NextResponse} from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req){
    const {username,password,email}=await req.json()

    // for testing purposes assume the email is verified using OTP
    const autho="user";
    const hpass=await bcrypt.hash(password,10);


    const { data,error}=await supabase
        .from("login_pass_table")
        .insert({username,hpass,email,autho})

    if(error){console.log(error);return NextResponse.json({message:"Something Went Wrong"},{status:401});}

    return NextResponse.json({message:"User Registered"},{status:200})
}