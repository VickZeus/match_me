import {NextResponse} from "next/server"
import clientPromise from "@/lib/mongodb"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
    const Data=await request.formData()

    const quizName=Data.get("quizName")
    const questions=JSON.parse(Data.get("question"))

    try{
        for(let i=0;i<questions.length;i++){
            const imageFile=Data.get(`image_${i}`)

            if(imageFile && imageFile.size>0){
                const fileName=`${quizName}_${i+1}`
                const buffer=Buffer.from(await imageFile.arrayBuffer())

                const {error}=await supabase.storage
                    .from("QImage_Bucket")
                    .upload(fileName,buffer,{contentType:imageFile.type})
                if(error) throw new Error(error.message)

                questions[i].imageUrl=supabase.storage.from("QImage_Bucket").getPublicUrl(fileName).data.publicUrl
            }
        }

        const client=await clientPromise
        const db=client.db("Match_Me_Quiz")
        const collection=db.collection("Questions")
        await collection.insertOne({
            quizName,
            questions,
            createdAt:new Date(),
            createdBy:"userId"
        })
        return NextResponse.json({message:"Form Submitted Successfully"},{status:200})
    }
    catch(err){
        console.log(err)
        return NextResponse.json({message:"Something Went Wrong!"},{status:500})
    }
}