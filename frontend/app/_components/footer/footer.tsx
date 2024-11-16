"use client"
import React from "react";

const Footer = ({source, transcript, setCurrentLine}: {source: any, transcript: {time: number, text: string}[], setCurrentLine: any}) => {
    const [duration, setDuration] = React.useState<number>(0)
    const [timestamp, setTimestamp] = React.useState<number>(0)

    React.useEffect(() => {
      console.log(source)
      if (document) {
        const audio = document.getElementById("audio") as any
        if (audio) {
          audio.firstChild.src = source
          audio.load();
          audio.onloadedmetadata = function() {
            console.log(audio.duration);
            audio.addEventListener('timeupdate', () => {
              if (!audio.paused) {
                setTimestamp((audio.currentTime / audio.duration) * 100)
              }
            });
            setDuration(audio.duration)
          };
        }
      }
    }, [source])

    React.useEffect(() => {
      if (transcript) {
        console.log(timestamp)
        for (let i = 0; i < transcript.length; i++) {
          const element = transcript[i];
          if (i+1 >= transcript.length && element.time <= duration) {
            console.log("heheheh")
            setCurrentLine(i)
            break
          }
          else if ((element.time <= ((timestamp / 100)*duration)) && (transcript[i+1].time > ((timestamp / 100)*duration))) {
            console.log((timestamp / 100)*duration)
            console.log(i)
            setCurrentLine(i)
            break
          }
        }
      }
    }, [transcript, timestamp]);

    function formatDuration(seconds: number) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
  
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
    return (
        <div className="flex flex-row w-full backdrop-blur backdrop-saturate-200 bg-white/60">
            <div className="rounded-lg shadow-lg p-6 w-full">
    <div className="flex items-center justify-between mb-4">
      <button className="text-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l9-6v12l-9-6zm11 0h4m-4 4h4" />
        </svg>
      </button>
      <button className="text-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
    <div className="flex items-center mb-4">
      <span className="font-bold text-sm">0:00</span>
      <input type="range" className="w-full mx-4" value={timestamp} onChange={(e) => {
        console.log(e.target.value)
        const audio = document.getElementById("audio") as any
        setTimestamp(parseFloat(e.target.value))
        audio.currentTime = duration * parseFloat(e.target.value) / 100
      }}/>
        <audio controls className="w-0 h-0 hidden" id="audio">
          <source src={source} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      <span className="font-bold text-sm">{formatDuration(duration)}</span>
    </div>
    <div className="flex items-center justify-between">
      <button className="text-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button className="text-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l9-6v12l-9-6zm11 0h4m-4 4h4" />
        </svg>
      </button>
    </div>
  </div>
        </div>
    )
}

export default Footer