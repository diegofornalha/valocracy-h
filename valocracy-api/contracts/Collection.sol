// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Collection
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation with enumerability and ownership features
 */
contract Collection is ERC721Enumerable, Ownable {

    /**
     * @dev Struct to define attributes for each NFT
     */
    struct Attributes {
        uint rarity;
        string imageURI;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    Attributes[] defaultCharacters; // Unused in current implementation

    mapping(uint256 => Attributes) public nftHolderAttributes;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` for the token collection.
     */
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        _tokenIds.increment(); // Ensure token IDs start from 1
    }

    /**
     * @dev Mints a new NFT with specific attributes to an address. Only the owner can mint.
     * @param _imageURI URI for the NFT image
     * @param _rarity Rarity level of the NFT
     * @param _address Address to which the NFT will be minted
     */
    function mintNFT(
        string memory _imageURI,
        uint _rarity,
        address _address
    ) 
        external onlyOwner 
    {

        uint256 newItemId = _tokenIds.current(); // Get the next token ID

        _safeMint(_address, newItemId); // Mint the token

        // Assign attributes to the minted token
        nftHolderAttributes[newItemId] = Attributes({
            imageURI: _imageURI,
            rarity: _rarity
        });

        _tokenIds.increment(); // Increment the token ID counter for the next mint
    }

    /**
     * @dev Overrides the base `tokenURI` function to return the URI for the metadata of the given token ID
     * @param _tokenId uint256 ID of the token to query
     * @return string memory representing the URI of the given token ID
     */
    function tokenURI(uint256 _tokenId) 
        public view override 
        returns (string memory) 
    {

        Attributes memory attributes = nftHolderAttributes[_tokenId]; // Get attributes of the token

        // Concatenate the base URI and the token-specific path to form the full URI
        string memory output = string(
            abi.encodePacked(attributes.imageURI)
        );

        return output;
    }

    /**
     * @dev Override for OpenZeppelin's `_beforeTokenTransfer` to prevent token transfers, making the tokens soulbound
     * @param from address representing the previous owner of the given token ID
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param batchSize uint256 represents the number of tokens to be transferred in a single transaction (unused here)
     */
    function _beforeTokenTransfer(
        address from, 
        address to, 
        uint256 tokenId, 
        uint256 
        batchSize
    ) 
        internal override 
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // Revert the transaction if it's a transfer attempt (not mint or burn)
        if (from != address(0) && to != address(0)) {
            revert("SoulboundNFT: cannot transfer Soulbound NFT");
        }
    } 

    /**
     * @dev Returns an array of token IDs owned by `_owner`
     * @param _owner address to query the tokens of
     * @return uint256[] List of token IDs owned by `_owner`
     */
    function tokensOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {

        uint256 tokenCount = balanceOf(_owner); // Number of tokens owned by `_owner`

        uint256[] memory tokensId = new uint256[](tokenCount); // Array to store token IDs

        // Populate the array with token IDs owned by `_owner`
        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokensId;
    }

    /**
     * @dev Returns the total amount of tokens minted so far.
     * @return uint256 representing the total supply of tokens
     */
    function suply() public view returns (uint256) 
    {
        return _tokenIds.current() - 1;
    }
}


