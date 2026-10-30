"use client";
import {useRouter} from "next/navigation"
import {useState,useEffect} from "react"
import {GRIDR} from "@/app/page"


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
            <GRIDR/>
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
    const router=useRouter();

    const [quizzes, setQuizzes] = useState([])
    const [mess, setMess] = useState("")
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const [chosen,setChosen]=useState("default")

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

    useEffect(()=>{getResults()},[])

    const filtered = quizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="text-sm p-3 rounded">
            <div className="pix mb-2">Quizzes</div>

            <div className="flex flex-col gap-2 border border-amber-50 rounded-lg w-full h-60 p-2 bg-black/80">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="shrink-0 w-full bg-transparent border border-amber-50 rounded px-2 py-1 outline-none placeholder:text-amber-50/50"
                />

                <div className={`flex-1 min-h-0 ${chosen==="default"?"overflow-y-auto":"overflow-hidden"}`}>
                    {loading && <div className="text-center">Loading...</div>}
                    {mess && <div className="text-center text-red-400">{mess}</div>}
                    {!loading && !mess && filtered.length === 0 && (
                        <div className="text-center">No quizzes found.</div>
                    )}

                    {(chosen==="default")?
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2" >
                            {filtered.map((quiz) => (
                                <button
                                    key={quiz._id}
                                    className="bg-purple-700 text-white p-2 rounded flex flex-col gap-1 text-xs"
                                    onClick={()=>setChosen(quiz.quizName)}
                                >
                                    <div className="pix text-[8px] break-words">{quiz.quizName}</div>
                                    <div className="truncate text-[10px]">Created By : {quiz.createdBy}</div>
                                </button>
                            ))}
                        </div>

                        :
    <div className="bg-radial from-gray-500 to-black h-full w-full flex flex-col p-2 gap-2">
    <button
        type="button"
        onClick={() => setChosen("default")}
        className="bg-red-600 w-5 h-5 text-xs flex items-center justify-center rounded-full shrink-0"
    >
        X
    </button>

    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
        <div className="pix text-[11px] break-words">{chosen}</div>
        <div className="text-xs text-gray-300">Description</div>
    </div>

    <button
        type="button"
        onClick={() =>router.push(`/quizTake?quiz=${encodeURIComponent(chosen)}`)}
        className="bg-green-400 text-white text-xs px-4 py-2 rounded self-center"
    >
        Take The Quiz
    </button>
    </div>
                    }

                </div>
            </div>
        </div>
    )
}

    
function LowerSection(){
    return (
        <div className="flex flex-col justify-around">

        </div>
    )
}

function UserScores() {
    const [scores, setScores] = useState(null); // null = loading

    useEffect(() => {
        const load = () =>
            fetch("/api/scores")
                .then((r) => r.json())
                .then((data) => setScores(Array.isArray(data) ? data : []))
                .catch(() => setScores([]));

        load();
        window.addEventListener("focus", load); // refetch when the tab regains focus
        return () => window.removeEventListener("focus", load);
    }, []);

    return (
        <div className="p-3 rounded-lg ">
            <div className="pix mb-2 text-[12px]">User Scores</div>
            <div className="bg-black flex flex-col gap-2 border border-amber-50 w-full h-fit overflow-y-auto rounded-lg p-2">
                {scores === null && (
                    <p className="text-center text-gray-400 text-xs mt-4">Loading...</p>
                )}

                {scores?.length === 0 && (
                    <p className="pix text-center text-gray-400 text-md mt-4">
                        No scores yet. Take a quiz!
                    </p>
                )}

                {scores?.map((s) => {
                    const pct=Number(s.score).toFixed(2);
                    const color ="bg-green-500" 
                    return (
                        <div key={s.quizname} className="rounded-lg bg-gray-900 p-2">
                            <div className="text-[7px] truncate pix" title={s.quizname}>
                                {s.quizname}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                <div
                                    className="h-2 flex-1 rounded-full bg-white/10"
                                    role="progressbar"
                                    aria-valuenow={pct}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`${s.quizname} score`}
                                >
                                    <div
                                        className={`h-2 rounded-full ${color}`}
                                        style={{ width: `${pct*100}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-bold w-9 text-right">{pct} /1</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function FindPeople(){
    return (
        <div className="p-3 rounded-lg ">
            <div className="pix mb-2 text-[12px]">Find People</div>
            <div className="flex flex-wrap gap-2 border bg-black/80 border-amber-50 justify-center w-full h-60 bg-black-200 overflow-y-auto rounded rounded-lg ">
            </div> 
        </div>
    )
}


export default function HomePage(){
    return(
        <div className="p-2 flex flex-col justify-center gap-3">
            <TopSection/>
            <MiddleSection/>
            <UserScores/>
            <FindPeople/>            
        </div>
    )
}