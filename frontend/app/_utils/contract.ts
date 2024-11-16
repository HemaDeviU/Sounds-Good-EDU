import { Abi, AbiEvent, parseAbiItem } from "viem";
import { Config } from "wagmi";
import { WriteContractMutate } from "wagmi/query";
import { publicClient } from "../_context/wallet";

const address: any = process.env.NEXT_PUBLIC_CONTRACT

export const writeContractHook = async (write: WriteContractMutate<Config, unknown>, abi: any, functionName: string, args: any[]) => {
    console.log("here")
    console.log(address)
    write({
        address,
        abi,
        functionName,
        args,
    })
}

export const logEvents = async (event: AbiEvent, args: any, fromBlock: bigint) => {
    const logs = await publicClient.getLogs({
        address,
        event,
        fromBlock,
        toBlock: "latest",
        args
    })
    return logs
}