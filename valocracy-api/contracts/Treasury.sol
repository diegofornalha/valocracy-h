// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Importing the ERC20 token interface and Ownable contract from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Treasury
 * @dev Contract to manage the withdrawal and tracking of ERC-20 tokens, with ownership control
 */
contract Treasury is Ownable {

    // Event to notify when tokens are withdrawn from the treasury
    event Withdrawn(address indexed _wallet, uint256 amount);

    /**
     * @dev Allows the owner to withdraw ERC-20 tokens from the contract to a specified wallet
     * @param _amount The amount of tokens to withdraw
     * @param _tokenAddress The address of the ERC-20 token to withdraw
     * @param _wallet The address of the wallet to which the tokens will be transferred
     */
    function withdraw(
        uint256 _amount, 
        address _tokenAddress, 
        address _wallet
    )   
        public onlyOwner 
    {
        
        // Ensures the contract has enough tokens before proceeding to transfer
        require(IERC20(_tokenAddress).balanceOf(address(this)) >= _amount, "Insufficient balance in contract");

        // Transfers the specified amount of tokens to the given wallet address
        IERC20(_tokenAddress).transfer(_wallet, _amount);

        // Emit an event for the withdrawal operation
        emit Withdrawn(_wallet, _amount);
    }

    /**
     * @dev Returns the total balance of ERC-20 tokens of a specific type held by the contract
     * @param _tokenAddress The address of the ERC-20 token
     * @return uint256 The total amount of the specified token held by the contract
     */
    function totalBalance(address _tokenAddress) 
        public view returns (uint256) 
    {
        // Returns the balance of the specified ERC-20 token held by the contract
        return IERC20(_tokenAddress).balanceOf(address(this));
    }
}
