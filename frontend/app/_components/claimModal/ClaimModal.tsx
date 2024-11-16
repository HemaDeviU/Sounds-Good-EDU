import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

const ClaimModal = ({ isOpen, onClose, remix }: {isOpen: boolean, onClose: any, remix: string | null}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isClaimed, setIsClaimed] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      setIsLoading(true);
      // Add your claim logic here
      setTimeout(() => {
        setIsLoading(false);
        setIsClaimed(true);
      }, 1000);
    };
  
    if (!isOpen) return null;
  
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      >
        <form 
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Claim your tokens</h2>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">SOUND 1,234</span>
                <div className="w-6 h-6 rounded-full bg-black"></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || isClaimed}
                className={`text-white px-4 py-2 rounded-lg focus:outline-none flex items-center justify-center ${
                  isLoading ? 'bg-gray-400' : 
                  isClaimed ? 'bg-green-500' :
                  'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {isLoading ? "Claiming..." : 
                 isClaimed ? (
                   <>
                     Claimed
                     <CheckIcon className="w-5 h-5 ml-2" />
                   </>
                 ) : "Claim"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
};

export default ClaimModal;