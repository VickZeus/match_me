import Image from "next/image";
import style from "@/styles/animations.module.css"


import { Geist, Geist_Mono, Poppins,Press_Start_2P } from "next/font/google";

const press_start_2p = Press_Start_2P({
  variable: "--font-press_start",
  subsets: ["latin"],
  weight: ["400"],
});


function GRID(){
  return (
    <div className={style.grid}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}


export default function Home() {
  return (
    <div className={`${press_start_2p.variable} ${style.template}`}>
        <div className={style.name}> 
          <div>Match</div>
          <div className={style.rowF}>
            KARO <GRID/> 
          </div>
        </div>
    </div>
  );
}
