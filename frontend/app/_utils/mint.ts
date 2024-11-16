import { Config } from "wagmi";
import { WriteContractMutate } from "wagmi/query";

const address: any = process.env.NEXT_PUBLIC_NFT

export const mintNFT = async (write: WriteContractMutate<Config, unknown>, abi: any, args: any[]) => {
    return write({
        address,
        abi,
        functionName: "safeMint",
        args,
    })
}