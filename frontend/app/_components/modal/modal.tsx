import { logEvents, writeContractHook } from '@/app/_utils/contract';
import { createNFTMetadata, uploadFile, uploadJson } from '@/app/_utils/ipfs';
import { useState } from 'react';
import { BaseError, useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import abi from "../../abi/abi.json"
import nft from "../../abi/nft.json"

import { parseAbi } from 'viem';
import { useDataStore } from '@/app/_context/data';
import Link from 'next/link';
import { mintNFT } from '@/app/_utils/mint';

const Modal = ({ isOpen, onClose, remix }: {isOpen: boolean, onClose: any, remix: string | null}) => {
    const { 
      data: hash,
      error,
      writeContract 
    } = useWriteContract() 

    const {
      podcastsData,
      storyClient,
      notifications
    } = useDataStore()

    const account = useAccount()


    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

    const [podcastName, setPodcastName] = useState<string>('');
    const [licenseType, setLicenseType] = useState<'free' | 'premium'>('free');

    const [mp3File, setMp3File] = useState<any>(null);
    const [cover, setCover] = useState<any>(null);

    const [transcriptsFile, setTranscriptsFile] = useState<any>(null);
  
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePodcastNameChange = (e: any) => {
      setPodcastName(e.target.value);
    };

    const handleMp3FileChange = (e: any) => {
      setMp3File(e.target.files[0]);
    };
  
    const handleTranscriptsFileChange = (e: any) => {
      setTranscriptsFile(e.target.files[0]);
    };
  
    const handleCoverChange = (e: any) => {
      setCover(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
      e.preventDefault()
      if (!remix) {
        setIsLoading(true)
        createNFTMetadata(podcastName, cover, mp3File, transcriptsFile, async (uri: string) => {
          console.log(uri)

        await writeContractHook(writeContract, abi, "registerandLicenseforUniqueIP", 
          [uri, 
          licenseType === 'free' ? '0x0000000000000000000000000000000000000000' : account.address])
        setIsLoading(false)
        onClose();
          })
      } else {
        createNFTMetadata(podcastName, cover, mp3File, transcriptsFile, async (uri: string) => {
          console.log(uri)
          const tokenId = await mintNFT(writeContract, nft, [account.address, uri])
          console.log(tokenId)
          const registeredIpAssetDerivativeResponse = await storyClient.ipAsset.register({
            nftContract: process.env.NEXT_PUBLIC_NFT,
            tokenId: 2,
            txOptions: { waitForTransaction: true },
          })
          console.log(registeredIpAssetDerivativeResponse.ipId)
          const linkDerivativeResponse = await storyClient.ipAsset.registerDerivativeWithLicenseTokens({
            childIpId: registeredIpAssetDerivativeResponse.ipId,
            licenseTokenIds: [notifications.filter(data => data.ipId === remix)[0].licenseTokenId],
            txOptions: { waitForTransaction: true },
          })
          await writeContractHook(writeContract,abi, "registerAndMintTokenForRemixIP", [1, linkDerivativeResponse.ipId])
        
          setIsLoading(false)
          onClose();
      })
      }
      

    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
        <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Podcast</h2>
            <p className="text-gray-600">Please fill in the details below.</p>
            {error && error.message}
          </div>
          {remix && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent">
                Parent Podcast
              </label>
              <input
                type="text"
                id="parent"
                value={podcastsData.filter(data => data.ipId === remix)[0].name}
                disabled
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="podcastName">
              {remix && "Remixed "}Podcast Name
            </label>
            <input
              required
              type="text"
              id="podcastName"
              value={podcastName}
              onChange={handlePodcastNameChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter podcast name"
            />
          </div>
          {!remix && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                License Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="licenseType"
                    value="free"
                    checked={licenseType === 'free'}
                    onChange={(e) => setLicenseType(e.target.value as 'free' | 'premium')}
                    className="mr-2"
                  />
                  <span>Free</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="licenseType"
                    value="premium"
                    checked={licenseType === 'premium'}
                    onChange={(e) => setLicenseType(e.target.value as 'free' | 'premium')}
                    className="mr-2"
                  />
                  <span>Premium</span>
                </label>
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mp3File">
              MP3 File
            </label>
            <div className="flex items-center">
              <label className="w-full p-3 border rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700 hover:bg-gray-200">
                <input
                  required
                  type="file"
                  id="mp3File"
                  onChange={handleMp3FileChange}
                  className="hidden"
                  accept='audio/wav, audio/mp3'
                />
                {mp3File ? mp3File.name : "Audio File (.wav, .mp3, etc)"}
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cover">
              Cover Image
            </label>
            <div className="flex items-center">
              <label className="w-full p-3 border rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700 hover:bg-gray-200">
                <input
                  required
                  type="file"
                  id="cover"
                  onChange={handleCoverChange}
                  className="hidden"
                  accept='image/png, image/jpeg, image/jpg'
                />
                {cover ? cover.name : "Image (.png, .jpg, etc)"}
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transcriptsFile">
              Transcripts File {"("}<Link className='text-blue-500' href={"https://rose-melodic-felidae-510.mypinata.cloud/ipfs/bafkreif2ybsgg3xe5heuswf6j2x2d2luji35gjzsn5uih5ujlbcnvys7di"} target='blank'>Sample</Link>{")"}
            </label>
            <div className="flex items-center">
              <label className="w-full p-3 border rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700 hover:bg-gray-200">
                <input
                  required
                  type="file"
                  id="transcriptsFile"
                  onChange={handleTranscriptsFileChange}
                  className="hidden"
                  accept='.txt'
                />
                {transcriptsFile ? transcriptsFile.name : "Text File (.txt)"}
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              disabled={isLoading || isConfirming}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 focus:outline-none hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isConfirming}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-blue-600"
            >
              {isLoading || isConfirming ? "Uploading ..." : "Submit"}
            </button>
          </div>
        </div>
        </form>
      </div>
    );
  };
  
  

export default Modal;