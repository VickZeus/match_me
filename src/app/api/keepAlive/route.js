// src/app/api/keepalive/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // never cache this route

export async function GET(request) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" automatically
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = { mongo: false, supabase: false, at: new Date().toISOString() };

  // MongoDB: one tiny read
  try {
    const client = await clientPromise;
    await client
      .db("Match_Me_Quiz")
      .collection("Questions")
      .findOne({}, { projection: { _id: 1 } });
    result.mongo = true;
  } catch (err) {
    console.error("Mongo keepalive failed:", err.message);
  }

  // Supabase: list one object from the image bucket
  try {
    const { error } = await supabase.storage
      .from("QImage_Bucket")
      .list("", { limit: 1 });
    if (error) throw new Error(error.message);

    result.supabase = true;
  } catch (err) {
    console.error("Supabase keepalive failed:", err.message);
  }

  const ok = result.mongo && result.supabase;
  return NextResponse.json(result, { status: ok ? 200 : 500 });
}