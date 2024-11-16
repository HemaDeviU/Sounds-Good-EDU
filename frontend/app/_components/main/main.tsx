"use client"
import React, { useState } from "react"
import Footer from "../footer/footer"
import Navbar from "../navbar/navbar"
import Recommendations from "../recommendations/recommendations"
import { useDataStore } from "@/app/_context/data"

const Main = ({index, setIndex}: {index: number, setIndex: any}) => {
    const [currentLine, setCurrentLine] = useState<number>(0)
    const [transcripts, setTranscripts] = useState<{time: number, text: string}[]>([])
    const {podcastsData} = useDataStore()

    const findCurrentLine = (currentTime: number) => {
        for (let i = 0; i < transcripts.length; i++) {
            if (i === transcripts.length - 1 || 
                (currentTime >= transcripts[i].time && currentTime < transcripts[i + 1].time)) {
                setCurrentLine(i)
                break
            }
        }
    }

    React.useEffect(() => {
        if (podcastsData.length > index) {
            (async () => {
                try {
                    // Using local file from public directory
                    const fileUrl = '/Transcripts.txt'  // Adjust path based on your file location
                    
                    const data = await fetch(fileUrl)
                    if (!data.ok) {
                        throw new Error(`HTTP error! status: ${data.status}`)
                    }
                    const res = await data.text()
                    setTranscripts(parseTranscripts(res))
                } catch (error) {
                    console.error("Failed to fetch transcript:", error)
                }
            })()
        }
    }, [podcastsData.length, index])

      const parseTranscripts = (transciptsText: string) => {
        const lines = transciptsText.split('\n');
        
        const transcripts = lines.map(line => {
          const [time, ...textParts] = line.split(' ');
          const text = textParts.join(' ');
          let timeInSeconds = 0;
          time.split(":").reverse().map((el, index) => {timeInSeconds += parseFloat(el)*(Math.pow(60, index))})
          return { time: timeInSeconds, text: text.trim() };
        });
        console.log(transcripts)
        return transcripts;
      };
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <div className="flex flex-row flex-grow">
                <div className="flex-grow pb-5">
                    <div className="flex flex-col backdrop-blur backdrop-saturate-200 rounded-lg h-full p-8 mb-8 w-full max-w-4xl mx-auto">
                        <div className="flex items-center mb-4 gap-5">
                            <div className="w-48 h-48 flex items-center bg-gray-200 rounded-lg overflow-hidden">
                                <img 
                                    src="/vitalik-buterin.jpg" 
                                    alt="Album Art" 
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">{podcastsData.length > index ? "The story of Vitalik Buterin" : "Loading..."}</h2>
                                <p className="text-lg text-gray-400">Vitalik</p>
                            </div>
                        </div>
                        <div className="flex flex-col bg-white/80 backdrop-blur backdrop-saturate-200 h-full rounded-lg p-4 h-64 overflow-y-auto font-bold text-xl gap-5 justify-center">
                            <p className="text-black/10">
                                {currentLine >= 3 ? transcripts[currentLine-3].text : ""}
                            </p>
                            <p className="text-black/20">
                                {currentLine >= 2 ? transcripts[currentLine-2].text : ""}

                            </p>
                            <p className="text-black/40">
                                {currentLine >= 1 ? transcripts[currentLine-1].text : ""}
                            </p>
                            <p>
                                {transcripts.length > 0 && transcripts[currentLine].text}
                            </p>
                            <p className="text-black/40">
                                {(currentLine + 1) < transcripts.length ? transcripts[currentLine+1].text : ""}
                            </p>
                            <p className="text-black/20">
                                {(currentLine + 2) < transcripts.length ? transcripts[currentLine+2].text : ""}
                            </p>
                            <p className="text-black/10"> 
                                {(currentLine + 3) < transcripts.length ? transcripts[currentLine+3].text : ""}
                            </p>
                        </div>
                    </div>
                </div>
                <Recommendations setIndex={setIndex}/>
            </div>
            <Footer source={podcastsData.length > 0 ? podcastsData[index].audio : ""} transcript={transcripts} setCurrentLine={findCurrentLine}/>
        </div>
    )
}

export default Main