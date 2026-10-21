"use client";
import {useRouter} from "next/navigation"
import {useState,useEffect} from "react"

function TopSection(){
    const router=useRouter();
    const [status,setStatus]=useState(false);
    
    async function handleLogOut(){
        try{
            await fetch("/api/auth/logout",{method:"POST"})
        }
        finally{
            setStatus(false);
            router.refresh();
        }

    }
    useEffect(()=>{
        fetch("/api/auth/cook_status")
        .then((res)=>setStatus(res.ok))
        .catch(()=>setStatus(false))
    })
    return (
        <div className="pix flex justify-between mt-2 ml-2"> 
            MatchKARO
            {
                (status)? 
                <button className="rounded rounded-sm bg-purple-500 text-white p-1 text-[12px]" onClick={()=>router.push("/profile")}>Profile</button> :
                <button className="rounded rounded-sm bg-amber-50 text-black p-1 text-[12px]" onClick={()=>router.push("/loginPage")}>Login</button>
            }
            <button className="rounded rounded-sm bg-red-500 text-white p-1 text-[12px]"  onClick={handleLogOut}>Log Out</button>
        </div>
    )
}


function MiddleSection(){

    async function getResults(){
        try{
            const res=await fetch("/api/fetchQuestion",{method:"GET"})
            console.log(res.json())
        }
        catch(error){
            console.log(error)
        }
    }
    return (
        <div className="text-sm p-3">
            <div className="pix mb-2">Quizzes</div>
            <div className="flex flex-wrap gap-2 border border-amber-50 rounded rounded-lg justify-center w-full h-60 bg-black/80 overflow-y-auto">
                <button className="border border-amber-50 w-fit p-2 h-fit " onClick={getResults}>Get Results</button>
            </div> 
        </div>
    )
}


function LowerSection(){
    return (
        <div className="flex justify-around">
            <UserScores/>
            <FindPeople/>
        </div>
    )
}


function UserScores(){
    return (
        <div className="text-sm p-3 rounded-lg">
            <div className="pix mb-2 text-[12px] ">User Scores</div>
            <div className="bg-black/80 flex flex-wrap gap-2 border border-amber-50 justify-center w-full h-60 overflow-y-auto rounded rounded-lg">
                
            </div> 
        </div>
    )
}

function FindPeople(){
    return (
        <div className="p-3 rounded-lg">
            <div className="pix mb-2 text-[12px]">Find People</div>
            <div className="flex flex-wrap gap-2 border bg-black/80 border-amber-50 justify-center w-full h-60 bg-black-200 overflow-y-auto rounded rounded-lg ">
            </div> 
        </div>
    )
}


export default function HomePage(){
    return(
        <div className="p-2 flex flex-col justify-center gap-5">
            <TopSection/>
            <MiddleSection/>
            <LowerSection/>             
        </div>
    )
}