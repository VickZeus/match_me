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

function MiddleSection() {
    const [quizzes, setQuizzes] = useState([])
    const [mess, setMess] = useState("")
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    async function getResults() {
        try {
            const res = await fetch("/api/fetchQuestion")
            if (!res.ok) {
                setMess("Quiz Fetch Failed.")
                return
            }
            setQuizzes(await res.json())
        } catch (error) {
            console.log(error)
            setMess("Quiz Fetch Failed.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getResults()
    }, [])

    const filtered = quizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="text-sm p-3">
            <div className="pix mb-2">Quizzes</div>

            <div className="flex flex-col gap-2 border border-amber-50 rounded-lg w-full h-60 p-2 bg-black/80">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="shrink-0 w-full bg-transparent border border-amber-50 rounded px-2 py-1 outline-none placeholder:text-amber-50/50"
                />

                <div className="flex-1 min-h-0 overflow-y-auto">
                    {loading && <div className="text-center">Loading...</div>}
                    {mess && <div className="text-center text-red-400">{mess}</div>}
                    {!loading && !mess && filtered.length === 0 && (
                        <div className="text-center">No quizzes found.</div>
                    )}

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
                        {filtered.map((quiz) => (
                            <div
                                key={quiz._id}
                                className="bg-purple-700 text-white p-2 rounded flex flex-col gap-1 text-xs"
                            >
                                <div className="pix text-[8px] break-words">{quiz.quizName}</div>
                                <div className="truncate text-[10px]">Created By : {quiz.createdBy}</div>
                            </div>
                        ))}
                    </div>
                </div>
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