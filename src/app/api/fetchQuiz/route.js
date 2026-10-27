import {NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb"; 
import {cookies} from "next/headers";
import {getUser} from "@/lib/getUser";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        const quizName = new URL(req.url).searchParams.get("quizName");
        if (!quizName) {
            return NextResponse.json({ error: "Missing quizName" }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db("Match_Me_Quiz");
        const quiz = await db.collection("Questions").findOne({ quizName },{ projection: { "questions.correct": 0 }});

        if (!quiz)return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        return NextResponse.json(quiz);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}


export async function POST(req) {
    const user = await getUser();
    if (!user)return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const {quizName,answers} = await req.json();
    console.log(quizName,answers,user)

    return NextResponse.json({ message: "Submitted" }, { status: 200 });
}