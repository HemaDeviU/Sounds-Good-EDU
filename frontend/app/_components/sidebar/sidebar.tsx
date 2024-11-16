import { useDataStore } from "@/app/_context/data"
import React from "react"

const Sidebar = ({index, setIndex}: {index: number, setIndex: any}) => {
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
    const { podcastsData } = useDataStore()
    return (
        <div className="flex flex-col min-h-screen w-1/4 justify-between shadow-lg backdrop-blur backdrop-saturate-200">
            <div className="flex flex-row items-center">
                <div className="font-bold text-2xl mt-5 ml-5 mb-8">
                    Soundsgood
                </div>
            </div>
            <div className="flex flex-col flex-grow w-full gap-4 p-5">
                <div className="text-gray-500 font-bold w-full text-xl">Discover</div>
                {/* <div className="flex flex-col gap-3 font-semibold w-full pl-4">
                    <div>Recently Added</div>
                    <div title="Coming soon..">Your Subscriptions</div>
                </div> */}
                <div className="text-gray-500 font-bold w-full text-xl">Favourites</div>
                {/* <div className="flex flex-col gap-3 font-semibold w-full pl-4">
                    <div>Podcast One</div>
                    <div>Podcast Two</div>
                    <div>Podcast Three</div>
                </div> */}

            </div>
            <div className="w-full h-60 bg-white/60 flex flex-col">
                <div className="flex flex-col space-x-4 items-center justify-between rounded-lg shadow-lg flex-grow">
                    <div className="flex flex-row justify-between">
                        <div className="p-6 pr-0 flex flex-col gap-3">
                            <h3 className="text-lg font-semibold">{podcastsData.length > index && "The story of Vitalik Buterin"}</h3>
                            <p className="text-sm">{podcastsData.length > index && "Vitalik"}</p>
                        </div>

                    </div>
                    <div className="flex space-x-8 ml-auto pb-4">
                        <button className="text-blue-500" onClick={() => {
                            setIndex((index-1+podcastsData.length) % podcastsData.length)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 19l-7-7 7-7v14zm9-14h-2v14h2v-14z" />
                            </svg>
                        </button>
                        <button className="text-white bg-blue-500 rounded-full p-4" onClick={() => {
                            if (!isPlaying) {
                                const audio = document.getElementById("audio") as any
                                console.log(audio)
                                audio.play()
                                audio.addEventListener('pause', () => setIsPlaying(false));
                                audio.removeEventListener('play', () => setIsPlaying(true));
                                setIsPlaying(true)
                            } else {
                                const audio = document.getElementById("audio") as any
                                console.log(audio)
                                audio.pause()
                                audio.addEventListener('play', () => setIsPlaying(true));
                                audio.removeEventListener('pause', () => setIsPlaying(false));
                                setIsPlaying(false)
                            }
                        }}>
                            {!isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            ): (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="6" y="4" width="4" height="16" fill="white"/>
                                    <rect x="14" y="4" width="4" height="16" fill="white"/>
                                </svg>
                            )}
                        </button>
                        <button className="text-blue-500" onClick={() => {
                            setIndex((index+1) % podcastsData.length)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 12l-7-7v14l7-7zM3 5v14h2V5H3z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar