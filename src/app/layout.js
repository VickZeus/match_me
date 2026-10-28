import { Geist, Geist_Mono,Press_Start_2P} from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const press_start_2p = Press_Start_2P({
  variable: "--font-press_start",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "MatchKARO",
  description: "Find People With Same Vibe !",
};




export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${press_start_2p.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
            {children}
            <Analytics/>
      </body>
    </html>
  );
}
