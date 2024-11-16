"use client"
import { useState } from "react";
import Modal from "../modal/modal";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDataStore } from "@/app/_context/data";
import NotificationBox from "../_notifications/notifications";
import ClaimModal from "../claimModal/ClaimModal";

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [remix, setRemix] = useState<string | null>(null);
    const {userName, notifications, tokenCount} = useDataStore()

    const [showNotifications, setShowNotifications] = useState(false);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
    
    const openModal = () => {
        setIsModalOpen(true);
    }
    
    const closeModal = () => {
        setRemix(null)
        setIsModalOpen(false);
    }

    const openClaimModal = () => {
        setIsClaimModalOpen(true);
    }
    
    const closeClaimModal = () => {
        setIsClaimModalOpen(false);
    }

    return (
        <div className="flex flex-row w-full p-5 gap-20 justify-between items-center">
            <div className="flex flex-row gap-2 flex-grow items-center">
                <div className="relative flex-grow" title="Coming Soon...">
                    <input type="text" disabled placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full w-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                    <svg className="w-5 h-5 text-gray-500 absolute left-6 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4a8 8 0 016.32 12.906l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387A8 8 0 118 4z"/>
                    </svg>
                </div>
                <div className="relative">
                    <button
                        className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-full shadow-lg focus:outline-none"
                        title="Your token balance"
                    >
                        <span className="mr-1">🪙</span> {tokenCount || 0}
                    </button>
                </div>
                <div className="relative">
                    <button
                        className="flex items-center justify-center p-3 bg-purple-500 text-white rounded-full shadow-lg focus:outline-none"
                        onClick={openModal}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>

                </div>
                <div className="relative">
                    <button
                        className="flex items-center justify-center p-3 bg-purple-500 text-white rounded-full shadow-lg focus:outline-none"
                        onClick={openClaimModal}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                </div>
                <div className="relative" onClick={handleToggleNotifications}>
                    <button className="flex items-center justify-center p-3 bg-white text-purple-500 rounded-full hover:bg-gray-200 focus:outline-none ring-2 ring-purple-500 shadow-lg">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 00-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m6 0a3 3 0 01-6 0" />
                        </svg>
                    </button>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                </div>
            </div>
            {showNotifications && (
                <div>
                <NotificationBox
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    setRemix={(i: string) => {
                        setRemix(i)
                        openModal()
                    }}
                />
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={closeModal} remix={remix}/>
            <ClaimModal isOpen={isClaimModalOpen} onClose={closeClaimModal} remix={remix} />

            <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                <div
                    {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    },
                    })}
                    className="bg-purple-500 rounded-full p-2 w-48 shadow-lg flex items-center justify-center font-bold text-white"
                >
                    {(() => {
                    if (!connected) {
                        return (
                        <button onClick={openConnectModal} type="button">
                            Connect Wallet
                        </button>
                        );
                    }

                    if (chain.unsupported) {
                        return (
                        <button onClick={openChainModal} type="button">
                            Wrong network
                        </button>
                        );
                    }
                    return (
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={openAccountModal} type="button">
                                {userName.length > 0 ? userName : account.displayName}
                                {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </button>
                        </div>
                    );
                    })()}
                </div>
                );
            }}
            </ConnectButton.Custom>
        </div>
    )
}

export default Navbar