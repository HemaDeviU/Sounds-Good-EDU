import { useDataStore } from "@/app/_context/data";


const PodcastTile = ({ image, title, creator, audio, setIndex }: {image: string, title: string, creator: string, audio: string, setIndex: any}) => {
    return (
        <div className="flex items-center gap-2 rounded-lg shadow-lg p-4 mb-4 w-full max-w-xl backdrop-blur backdrop-saturate-200 shadow-lg bg-white/50 cursor-pointer" onClick={setIndex}>
            <div className="w-36 h-36 flex items-center">
                <img src={image} alt="Podcast Art" className="rounded-lg mr-4" />
            </div>
            <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-black/70">{creator}</p>
            </div>

        </div>
    );
}

const PodcastList = ({setIndex}: {setIndex: any}) => {
    const {podcastsData} = useDataStore()
    
    console.log("All podcasts:", podcastsData);
    
    podcastsData.forEach((podcast, index) => {
        console.log(`Podcast ${index + 1}:`, {
            name: podcast.name,
            owner: podcast.owner,
            cover: podcast.cover,
            // Add any other fields you want to check
        });
    });

    return (
        <div className="flex flex-col items-center backdrop-blur backdrop-saturate-200 shadow-2xl p-6 h-[40rem] overflow-y-scroll">
            {podcastsData.map((podcast, index) => (
                <PodcastTile
                    setIndex={() => setIndex(index)}
                    key={index}
                    image="/vitalik-buterin.jpg"
                    title="Vitalik Buterin Podcast"
                    creator="Vitalik"
                    audio="/Vitalik Buterin on rBitcoin censorship.mp3"
                />

                
            ))}
        </div>
    );
}


const Recommendations = ({setIndex}: { setIndex: any}) => {
    return (
        <div className="w-1/3 pr-6 pb-6">
            <PodcastList setIndex={setIndex}/>
        </div>
    )
}

export default Recommendations