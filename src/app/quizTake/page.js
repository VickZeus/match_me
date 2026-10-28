"use client";
import {useEffect, useRef, useState,Suspense} from "react";
import {useSearchParams,useRouter} from "next/navigation";


const QUIZ_SECONDS = 120;

function TestPage() {
    const params = useSearchParams();
    const quizName = params.get("quiz");

    const [quiz, setQuiz] = useState("No Quiz Found");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState();
    const [answers, setAnswers] = useState({});   // { "Question text": "A" }
    const [timeLeft, setTimeLeft] = useState(QUIZ_SECONDS);
    const [submitted, setSubmitted] = useState(false);
    const router=useRouter();
    const answersRef = useRef(answers);          // always holds the latest answers
    const submittedRef = useRef(false);          // guards against double submit
    useEffect(() => { answersRef.current = answers; }, [answers]);

    useEffect(() => {
        if (!quizName) {
            setLoading(false);
            setErr("No Quiz Selected");
            return;
        }
        setQuiz(quizName);

        async function Load() {
            const res = await fetch(
                `/api/fetchQuiz?quizName=${encodeURIComponent(quizName)}`,
                { method: "GET" }
            );
            if (!res.ok) { setErr("Quiz Fetch Failed"); setLoading(false); return; }

            const data = await res.json();
            setQuestions(data);
            setLoading(false);
        }
        Load();
    }, [quizName]);

    // countdown: starts once questions are loaded, stops after submit
    useEffect(() => {
        if (!questions || submitted) return;
        const id = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [questions, submitted]);

    // auto-submit at 0
    useEffect(() => {
        if (timeLeft === 0 && questions) submitQuiz();
    }, [timeLeft]);

    async function submitQuiz() {
        
        if (submittedRef.current) return;
        submittedRef.current = true;
        setSubmitted(true);

        try {
            const res = await fetch("/api/fetchQuiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizName,
                    answers: answersRef.current,
                }),
            });
            if (!res.ok) throw new Error("Submit failed");
            router.replace("/home")
        } catch (e) {
            console.error(e); 
            setErr("Could not submit quiz");
        }
    }

    function selectOption(question, letter) {
        if (submitted) return;
        setAnswers((prev) => {
            const next = { ...prev };
            if (next[question] === letter) delete next[question];  // click again = deselect
            else next[question] = letter;                          // select or switch
            return next;
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        submitQuiz();
    }

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");

    return (
        <div className="h-screen w-screen">
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="pix text-[16px] text-center my-5 mx-2 wrap-break-word">{quiz}</div>

                <div className={`sticky top-0 z-10 mb-3 px-4 py-1 rounded-full ${timeLeft <= 30 ? "bg-red-600" : "bg-white"}  font-mono text-sm ${timeLeft <= 30 ? "text-white" : "text-black"}`}>
                    Time Left: {mins}:{secs}
                </div>

                {err && <div className="text-red-500 mb-3">{err}</div>}

                {questions?.questions.map((q, i) => (
                    <div key={i} className="bg-gray-800 h-fit w-85 p-2 mb-3 rounded-lg flex flex-col">
                        <div className="text-center mb-2 font-serif">{i + 1}. {q.Question}</div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-serif">
                            <button type="button" disabled={submitted} onClick={() => selectOption(q.Question, "A")}
                                className={`w-full text-center wrap-break-word rounded-lg ${answers[q.Question] === "A" ? "bg-green-600" : "bg-gray-700"}`}>
                                A. {q.optionA}
                            </button>
                            <button type="button" disabled={submitted} onClick={() => selectOption(q.Question, "B")}
                                className={`w-full text-center wrap-break-word rounded-lg ${answers[q.Question] === "B" ? "bg-green-600" : "bg-gray-700"}`}>
                                B. {q.optionB}
                            </button>
                            <button type="button" disabled={submitted} onClick={() => selectOption(q.Question, "C")}
                                className={`w-full text-center wrap-break-word rounded-lg ${answers[q.Question] === "C" ? "bg-green-600" : "bg-gray-700"}`}>
                                C. {q.optionC}
                            </button>
                            <button type="button" disabled={submitted} onClick={() => selectOption(q.Question, "D")}
                                className={`w-full text-center wrap-break-word rounded-lg ${answers[q.Question] === "D" ? "bg-green-600" : "bg-gray-700"}`}>
                                D. {q.optionD}
                            </button>
                        </div>
                    </div>
                ))}

                <button type="submit" disabled={submitted} className="bg-green-500 px-4 py-1 rounded-full disabled:opacity-50 mb-5">
                    {submitted ? "Submitted" : "Submit"}
                </button>
            </form>
        </div>
    );
}


export default function QuizTakePage(){
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <TestPage/>
        </Suspense>
    )
}