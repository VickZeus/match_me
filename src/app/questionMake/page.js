"use client"
import React from "react";
import {useState} from "react";






export default function QuestionMakePage(){
  const [errMessage,setErrMessage]=useState("")
  const [question,setQuestion]=useState([{id:Date.now(),Question:"",optionA:"",optionB:"",optionC:"",optionD:"",correct:"",image:null}])
  const [quizName,setQuizName]=useState("")

  async function handleSubmit(e){
    e.preventDefault();
    try{
        const fd=new FormData()
        fd.append("quizName",quizName)
        fd.append("question",JSON.stringify(question.map(({id,image,...rest})=>rest)))
        
        question.forEach((q, i) => {
          if (q.image) fd.append(`image_${i}`, q.image);
        });

        const res=await fetch("/api/makeQuestion",{
           body:fd,
           method:"POST"
        })
        
        if(res.ok){
          setErrMessage("Form submitted successfully!")
        }
        else{
          const data=await res.json()
          setErrMessage("Something Went Wrong!")
          console.log(data.message)
        }
    }
    catch(err){
       console.log(err)
       setErrMessage("An error occurred while submitting the form.")
    }
  }

  function addQuestion(){
    setQuestion([...question,{id:Date.now(),Question:"",optionA:"",optionB:"",optionC:"",optionD:"",correct:"",image:null}])
  }

  function removeQuestion(id) {
    setQuestion(question.filter((q) => q.id !== id));
  }

  function updateQuestion(id, field, value) {
    setQuestion(
      question.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  }

  return(
    <div className="h-screen w-screen bg-black-400 p-2">
      
      <form onSubmit={handleSubmit} className=" border-transparent outline-none flex flex-col gap-1 items-center bg-transparent text-white rounded-md py-4 overflow-y-auto h-full">
        <h1 className="text-3xl font-bold">Quiz Making Portal</h1>

        <div className="flex gap-2 text-md my-2">
          <p className="font-bold">Quiz Name: </p>
          <input placeholder="Enter Quiz Name" className="bg-white text-black px-2 outline-none rounded-sm " value={quizName} onChange={(e) => setQuizName(e.target.value)}/>
        </div>


        {question.map((q, index) =>(
        <div key={q.id} className="bg-black text-white p-3 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.15)] border-gray-100">
          
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p className="font-bold">{index+1}. Question: </p>
              <button className="flex bg-red-500 text-white text-xl rounded-full w-5 h-5 items-center justify-center" type="button" onClick={() => removeQuestion(q.id)}>X</button>
            </div>
            <textarea placeholder="Enter Question" value={q.Question} className="bg-transparent  rounded-sm border border-white outline-none m-2 p-2 focus:bg-gray-100 focus:text-black font-bold" onChange={(e) => updateQuestion(q.id, "Question", e.target.value)} rows="3"/>
          </div>

            
          <div className="flex gap-2">
            <p className="font-bold">Option A :</p>
            <input className="outline-none px-1 w-1/2 focus:bg-green-500" placeholder="Option-A" value={q.optionA} onChange={(e) => updateQuestion(q.id, "optionA", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Option B :</p>
            <input className="outline-none px-1 w-1/2 focus:bg-green-500" placeholder="Option-B" value={q.optionB} onChange={(e) => updateQuestion(q.id, "optionB", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Option C :</p>
            <input className="outline-none px-1 w-1/2 focus:bg-green-500" placeholder="Option-C" value={q.optionC} onChange={(e) => updateQuestion(q.id, "optionC", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Option D :</p>
            <input className="outline-none px-1 w-1/2 focus:bg-green-500" placeholder="Option-D" value={q.optionD} onChange={(e) => updateQuestion(q.id, "optionD", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Correct Option : </p>
            <select className="bg-white text-black w-10 h-6" value={q.correct} onChange={(e) => updateQuestion(q.id, "correct", e.target.value)}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          
          <input
            type="file"
            className="m-2"
            accept="image/jpeg,image/png,image/webp"
            placeholder="Upload Image (Optional) : "
            onChange={(e) => {
              const file = e.target.files[0] || null;
              if (file && file.size > 2 * 1024 * 1024) {
                alert("Image must be under 2 MB");
                e.target.value = "";
                return;
              }
              updateQuestion(q.id, "image", file);
            }}
          />

        </div>
        ))
        }
        <button type="button" onClick={addQuestion}   className="text-black bg-amber-400 w-10 h-10 rounded-full text-2xl flex items-center justify-center">+</button>
        <p>{errMessage}</p>
        <button type="submit" className="text-white text-xl bg-green-400 rounded-lg px-2 py-1">Submit</button>
      </form>
    </div>
  )
}