"use client"
import react from "react";
import {useState} from "react";


function Fuse(Question,Answer){
    return(
        <div className="flex flex-row space-between ">
            <p>{Question}</p>
            <input placeholder={Answer}/>
        </div>
    )
}





function QuestionFormat(object){
    const[question,setQuestion]=useState("")
    const[optionA,setOptionA]=useState("") 
    const[optionB,setOptionB]=useState("") 
    const[optionC,setOptionC]=useState("") 
    const[optionD,setOptionD]=useState("")
    
    return(
        <div className="bg-black text-yellow-400">


            <div>
                
            </div>
        </div>
    )
}


export default function QuestionMakePage(){
    return(
        <>
            {/* <h1>Make Questions</h1> */}
            <QuestionFormat object={""}/>
        </>
    )
}