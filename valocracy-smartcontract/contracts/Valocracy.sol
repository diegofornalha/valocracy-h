// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Importing the previously defined Treasury and Collection contracts
import "./Treasury.sol";
import "./Collection.sol";

/**
 * @title Valocracy
 * @dev Extends functionality from both Treasury and Collection contracts
 * to create a unified contract with capabilities of handling ERC-20 tokens
 * and managing an NFT collection.
 */
contract Valocracy is Treasury, Collection {

    /**
     * @dev Constructor for Valocracy which sets up the NFT collection by calling
     * the Collection constructor with a name and symbol for the NFTs.
     * @param _nftName The name to assign to the NFT collection
     * @param _nftSymbol The symbol to represent the NFT collection
     */
    constructor(string memory _nftName, string memory _nftSymbol) 
    Collection(_nftName, _nftSymbol)
    {
     
    }

}
