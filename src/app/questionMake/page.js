"use client"
import React from "react";
import {useState} from "react";



export default function QuestionMakePage(){

  const [question,setQuestion]=useState([])

  async function handleSubmit(e){
    e.preventDefault();
    console.log(question)
  }

  function addQuestion(){
    setQuestion([...question,{id:Date.now(),Question:"",OptionA:"-",OptionB:"-",OptionC:"-",OptionD:"-",correct:"-",image:null}])
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
    <div className="h-screen w-screen bg-white p-2">
      
      <form onSubmit={handleSubmit} className=" border-transparent outline-none flex flex-col gap-1 items-center bg-transparent text-black rounded-md py-4 overflow-y-auto h-full">
        <h1 className="text-3xl font-bold">Quiz Making Portal</h1>

        <div className="flex gap-2 text-md">
          <p>Quiz Name: </p>
          <input placeholder="Enter Quiz Name"/>
        </div>


        {question.map((q, index) =>(
        <div key={q.id} className="bg-black text-white p-3 rounded-sm ">
          
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p>{index+1}. Question: </p>
              <button className="flex bg-red-500 text-white text-xl rounded-full w-5 h-5 items-center justify-center" type="button" onClick={() => removeQuestion(q.id)}>-</button>
            </div>
            <textarea placeholder="Enter Question" value={q.Question} className="bg-transparent  rounded-sm border border-white outline-none m-2 p-2" onChange={(e) => updateQuestion(q.id, "Question", e.target.value)} rows="3"/>
          </div>


          <div className="flex gap-2">
            <p>Option A :</p>
            <input placeholder="Option-A" value={q.optionA} onChange={(e) => updateQuestion(q.id, "optionA", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p>Option B :</p>
            <input placeholder="Option-B" value={q.optionB} onChange={(e) => updateQuestion(q.id, "optionB", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p>Option C :</p>
            <input placeholder="Option-C" value={q.optionC} onChange={(e) => updateQuestion(q.id, "optionC", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p>Option D :</p>
            <input placeholder="Option-D" value={q.optionD} onChange={(e) => updateQuestion(q.id, "optionD", e.target.value)}/>
          </div>

          <div className="flex gap-2">
            <p>Correct Option : </p>
          <select className="bg-white text-black w-10 h-6" value={q.correct} onChange={(e) => updateQuestion(q.id, "correct", e.target.value)}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          </div>
          
        </div>
        ))
        }
        <button type="button" onClick={addQuestion}   className="text-black bg-amber-400 w-10 h-10 rounded-full text-2xl flex items-center justify-center">+</button>
        <button type="submit" className="text-white text-xl bg-green-400 rounded-lg px-2 py-1">Submit</button>
      </form>
    </div>
  )
}