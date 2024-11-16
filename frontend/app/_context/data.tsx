"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { readContract } from '@wagmi/core'
import { config } from "../_config/wallet";

import abi from "../abi/abi.json"
import { useAccount, useWriteContract } from "wagmi";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { logEvents, writeContractHook } from "../_utils/contract";
import { custom, parseAbiItem } from "viem";

type PodcastData = {
    tokenId: number,
    ipId: `0x${string}`,
    audio: string,
    transcripts: string,
    cover: string,
    name: string,
    owner: string
}

export type Notification = {
    ipId: `0x${string}`,
    recipient: `0x${string}`,
    licenseTokenId: number
}

type Props = {
    children?: React.ReactNode;
};

type StoreState = {
    podcastsData: PodcastData[],
    userName: string,
    notifications: Notification[],
    storyClient: any
}

const DataContext = createContext<StoreState>({
    podcastsData: [],
    userName: "",
    notifications: [],
    storyClient: undefined
});

export const useDataStore = () => useContext(DataContext);

export const DataContextProvider = (props: Props) => {
    const [ podcastsData, setPodcastData ] = useState<PodcastData[]>([]);
    const [ userName, setUserName ] = useState<string>("");
    const [ notifications, setNotifications ] = useState<Notification[]>([]);
    const [ client, setClient ] = useState<any>(undefined);
    const account = useAccount()
    const { 
        writeContract 
      } = useWriteContract() 

    useEffect(() => {
        (async () => {
            let podcasts: PodcastData[] = [];
            const contract: any = process.env.NEXT_PUBLIC_CONTRACT
            const result = await readContract(config, {
                abi,
                address: contract,
                functionName: "getIpDetails",
            })
            console.log(result)
            if (Array.isArray(result)) {
                result.map(async (el: any) => {
                    let res = await readContract(config, {
                        abi,
                        address: contract,
                        functionName: "tokenURI",
                        args: [el.tokenId]
                    }) as string
                    let reqData = await fetch(res)
                    let json = await reqData.json()
                    let extReqData = await fetch(json["external_url"])
                    let jsonExt = await extReqData.json()
                    let ipOwner = await readContract(config, {
                        abi,
                        address: contract,
                        functionName: "owner",
                        args: [el.tokenId]
                    }) as `0x${string}`
                    let ownerName = await readContract(config, {
                        abi,
                        address: contract,
                        functionName: "getUserName",
                        args: [ipOwner]
                    }) as string
                    let data: PodcastData = {
                        tokenId: parseInt(el.tokenId),
                        ipId: el.ipId,
                        name: json.name,
                        audio: jsonExt.audio,
                        transcripts: jsonExt.transcripts,
                        cover: json.image,

                        owner: ownerName
                    }
                    console.log(data)
                    podcasts.push(data)
                    setPodcastData(podcasts)
                });
            }
        })()
    }, [])

    useEffect(() => {
        if (account.address) {
            (async () => {
                const contract: any = process.env.NEXT_PUBLIC_CONTRACT
                try {
                    let res = await readContract(config, {
                        abi,
                        address: contract,
                        functionName: "getUserName",
                        args: [account.address]
                    }) as string
                    setUserName(res)
                } catch (err) {
                    setUserName("")
                }
                console.log("here")
                const events = await logEvents(
                    parseAbiItem("event remixPermissionGranted(address indexed, address indexed, uint256)"),
                    {
                        recipient: account.address
                    },
                    BigInt(5980471),
                )
                console.log(events)
                let notifs: Notification[] = events.filter(event => (event.args as any[])[1] === account.address).map((event) => {
                        return {
                            ipId: (event.args as any[])[0] as string,
                            recipient: (event.args as any[])[1] as string,
                            licenseTokenId: (event.args as any[])[2] as number
                        } as Notification
                })
                setNotifications(notifs)
                const sconfig: StoryConfig = {
                    transport: custom(window.ethereum),
                    account: account.address, // the account address from above
                    chainId: 'sepolia'
                  };
                setClient(StoryClient.newClient(sconfig));
            })()
        }
    }, [account.address])

    return (
        <DataContext.Provider value={{
            podcastsData,
            userName,
            notifications,
            storyClient: client
        }}>
            {props.children}
        </DataContext.Provider>
    )
}