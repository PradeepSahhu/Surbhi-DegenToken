// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./GameNFT.sol";

contract DegenTokenContract is ERC20 {
    address public owner;
    GameNFT public immutable gameInstance;
    uint private _perAmount;

    modifier onlyOwner() {
        require(msg.sender == owner, "You  are not the owner");
        _;
    }

    constructor(uint _tokenToMint, uint _perTokenAmount) ERC20("Degen", "DGN") {
        gameInstance = new GameNFT();
        _perAmount = _perTokenAmount;
        _mint(msg.sender, _tokenToMint);
        owner = msg.sender;
    }

    function balance() external view returns (uint) {
        return balanceOf(msg.sender);
    }

    function returnPerAmount() external view returns (uint) {
        return _perAmount;
    }

    function returnAsset() external view returns (address) {
        return address(gameInstance);
    }

    function returnOwner() external view returns (address) {
        return owner;
    }

    function redeemTokens(string memory _URI, uint _NftPrice) external {
        require(balanceOf(msg.sender) >= _NftPrice);
        _transfer(msg.sender, address(this), _NftPrice);
        gameInstance.gameAssetMint(msg.sender, _URI);
    }

    function getToMintNFT() external view returns (string[] memory) {
        return gameInstance.returnToMintNFT();
    }

    function addNFTURI(string memory _URI) external {
        gameInstance.addMintNFT(_URI);
    }

    function buyTokens(uint _amount) external payable {
        uint totalPayableAmount = _amount * _perAmount;
        require(msg.value >= totalPayableAmount, "Not Enough Wei");
        uint remainingBalance = msg.value - totalPayableAmount;
        (bool res, ) = payable(msg.sender).call{value: remainingBalance}("");
        require(res);
        _mint(msg.sender, _amount);
    }

    function tranferTokens(address _recepient, uint _amount) external {
        require(balanceOf(msg.sender) >= _amount);
        transfer(_recepient, _amount);
    }

    function getMintedNFT() external view returns (string[] memory) {
        return gameInstance.returnMintedNFT(msg.sender);
    }

    function burnToken(uint _tokenAmount) external {
        require(balanceOf(msg.sender) >= _tokenAmount);
        _burn(msg.sender, _tokenAmount);
    }

    function withdrawEther() external onlyOwner {
        (bool res, ) = payable(owner).call{value: balanceOf(address(this))}("");
        require(res);
    }

    receive() external payable {}
}
