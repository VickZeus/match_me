import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic="force-dynamic"

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db("Match_Me_Quiz")

        const quizzes = await db
            .collection("Questions")
            .find({}, { projection: {quizName:1,createdBy:1} }) // only these fields
            .sort({ createdAt: -1 })
            .toArray() // find() returns a cursor, toArray() actually fetches
        return NextResponse.json(quizzes)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Something Went Wrong!" }, { status: 500 })
    }
}