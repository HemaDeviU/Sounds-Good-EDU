// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./SoundToken.sol";
import "./GoodNFT.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface TokenInterface {
    function mint(address account, uint256 amount) external;
}

interface IChronicle {
    function read() external view returns (uint256 value);
}

interface ISelfKisser {
    function selfKiss(address oracle) external;
} 

contract Core is ReentrancyGuard {
    struct Episode{
        uint256 episodeId;
        string metadataURI;
        address creator; 
        bool premium;
    }

    struct ListenRewards {
        uint256 rewards;
        mapping(uint256 => bool) hasListened;
    }

    constructor(address _soundToken, address _goodNFT){
        soundToken = SoundToken(_soundToken);
        goodNFT = GoodNFT(_goodNFT);
    selfKisser = ISelfKisser(address(0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d));
    chronicle = IChronicle(address(0xdd6D76262Fd7BdDe428dcfCd94386EbAe0151603));
    selfKisser.selfKiss(address(chronicle)); 

    }


    SoundToken public soundToken;
    GoodNFT public goodNFT;
   IChronicle public chronicle; 
    ISelfKisser public selfKisser;

    TokenInterface public minter;
    
    uint256 public immutable burnAmount = 2;


    event EpisodeCreated(uint256 episodeId);
    event TokensClaimed(address indexed listener, uint256 episodeId, uint256 amount);
    mapping (uint256 => Episode) public episodes;
    mapping(address => ListenRewards) public listenRewards;


    function createEpisodeandMintNFT(string memory _metadata, bool _premium) external returns (uint256)
    {
        uint256 id =goodNFT.safeMint(msg.sender,_metadata);
        episodes[id] = Episode({
            episodeId: id,
            metadataURI: _metadata,
            creator: msg.sender,
            premium: _premium
        });
        emit EpisodeCreated(id);
        return id;
    
    }

    function claimToken(uint256 episodeId) nonReentrant external returns (uint256)
{
    require(_exists(episodeId),"episode doesn't exists");
    require(episodes[episodeId].premium,"Episode is not premium");
    address listener = msg.sender;
    require(!listenRewards[listener].hasListened[episodeId],"You have already listened to this episode"); 
    listenRewards[listener].hasListened[episodeId] = true;
    listenRewards[listener].rewards += 1;
    emit TokensClaimed(msg.sender, episodeId, 1);
    return listenRewards[listener].rewards;
}

    function listenPremium(uint256 episodeId) external nonReentrant{
    require(_exists(episodeId),"episode doesn't exists");
    require(episodes[episodeId].premium,"Episode is not premium");
    address listener = msg.sender;
    soundToken.burnFrom(listener,burnAmount);    
    emit TokensClaimed(msg.sender, episodeId, 0);
         
}
    function tipCreator(address creator, uint256 amount) external nonReentrant{
        require(soundToken.balanceOf(msg.sender)>= amount,"Insufficient balance");
        (bool success,)= payable(creator).call{value: amount}("");
        require(success,"Transfer failed");
    } 

    function withdraw(uint256 amount) external nonReentrant{
        amount = listenRewards[msg.sender].rewards;
        require(amount > 0,"No tokens to withdraw");
        listenRewards[msg.sender].rewards = 0;
        soundToken.mint(msg.sender,amount);
    }

    function getEpisode(uint256 _episodeId) external view returns (Episode memory){
        return episodes[_episodeId];
    }
    function _exists(uint256 _episodeId) internal view returns (bool){
        return bytes(episodes[_episodeId].metadataURI).length >0;

    }
   
     

    function _read() internal view returns (uint256 val) {
        val = chronicle.read();
    }

    function mintSoundToken() external payable{
    
        require(msg.value > 0, "Must send ETH to mint tokens");
        uint256 ethUsd = _read(); 
        uint256 amountUSD = (msg.value * ethUsd) / 10 ** 18; 
        uint256 amountToken = amountUSD / 10 ** 18; 
        soundToken.mint(msg.sender,amountToken);
    } 

   
}
