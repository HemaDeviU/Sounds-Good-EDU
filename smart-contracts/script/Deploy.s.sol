// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/SoundToken.sol";
import "../src/GoodNFT.sol";
import "../src/Core.sol";
import "forge-std/Vm.sol";

contract Deploy is Script {
    function run() external {
        // Start broadcasting transactions
        vm.txGasPrice(1000000000000000000);

        vm.startBroadcast();
     console.log(msg.sender);
        // Deploy SoundToken
        SoundToken soundToken = new SoundToken();
        console.log("SoundToken deployed to:", address(soundToken));

        // Deploy GoodNFT
        GoodNFT goodNFT = new GoodNFT();
        console.log("GoodNFT deployed to:", address(goodNFT));

       

         // Deploy Core with addresses of SoundToken and GoodNFT
        Core core = new Core(address(soundToken), address(goodNFT));
        console.log("Core deployed to:", address(core));
        // Transfer ownership of SoundToken and GoodNFT to Core
        soundToken.transferOwnership(address(core));
        console.log("Ownership of SoundToken transferred to Core");

        goodNFT.transferOwnership(address(core));
        console.log("Ownership of GoodNFT transferred to Core");


        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}