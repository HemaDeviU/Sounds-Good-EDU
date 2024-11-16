// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./SoundToken.sol";
import "./GoodNFT.sol";


contract Core {

    constructor()

    SoundToken public soundToken;
    GoodNFT public goodNFT;

    function createEpisodeandMintNFT(string memory _metadata) external returns (uint256 episodeId)
    {
        uint256 episodeId =goodNFT.safeMint(msg.sender,_metadata);
        emit EpisodeCreated(episodeId);
        return episodeId;
    
    }

    function claimToken(uint256 episodesCount, address to) external returns (uint256)
    {

    }
    function tipCreator(address creator, uint256 amount) external nonReentrant{
        require(soundToken.balanceOf(msg.sender)>= amount,"Insufficient balance");
        soundToken._burn(msg.sender,amount);
        (bool success,)= payable(creator).call{value: amount}("");
        require(success,"Transfer failed");
    } 

    function withdraw(uint256 amount) external nonReentrant{
        uint256 amount = listenerRewards[msg.sender];
        require(amount > 0,"No tokens to withdraw");
        listenerRewards[msg.sender] =0;
        (bool success,) = payable(msg.sender).call{value:amount}("");
        require(success,"Transfer failed");

    }

    function getEpisode(uint256 _episodeId) external view returns (Episode memory){
        return episodes[_episodeId];
    }


}
