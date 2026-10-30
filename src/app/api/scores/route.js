import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const key = `scores:${user.username}`;

  // 1) Try the cache first (a Redis failure never breaks the endpoint)
  try {
    const cached = await redis.get(key);
    if (cached) return NextResponse.json(cached);
  } catch (e) {
    console.log("Redis read failed", e);
  }

  // 2) Cache miss: read from Supabase
  const { data, error } = await supabase
    .from("user_scores")
    .select("quizname, score, created_at")
    .eq("username", user.username)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  // 3) Store in cache for 1 hour
  try {
    await redis.set(key, data, { ex: 3600 });
  } catch (e) {
    console.log("Redis write failed", e);
  }

  return NextResponse.json(data);
}