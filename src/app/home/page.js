function TopSection(){
    return (
        <div className="pix flex justify-between mt-2 ml-2"> 
            MatchKARO
            <p>P</p>
        </div>
    )
}


function MiddleSection(){
    return (
        <div className="text-sm p-3">
            <div className="pix mb-2">Quizzes</div>
            <div className="flex flex-wrap gap-2 border border-amber-50 rounded rounded-lg justify-center w-full h-60 bg-black/80 overflow-y-auto">

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