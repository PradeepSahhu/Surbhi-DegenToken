"use client";
import { useEffect, useState } from "react";

import Card from "@/components/Cards/Card";
import BoughtCard from "@/components/Cards/BoughtCard";
// import ZoomCard from "@/components/PopUps/ZoomCard";
// import MarketPlaceConnection from "@/Operations/MarketPlaceConnection";
import IpfsToArray from "@/Connections/Functionality/realPFS";
import { ethers } from "ethers";

export default function BoughtNFT() {
  const [mintedNFT, setMintedNft] = useState();

  const contractInstance = "0xb999e3C80150322c7bd6d1aFB5860d3f65CDa912";
  const contractABI = process.env.abi;
  const [medicalContract, setMedicalContract] = useState();

  const Starting = async () => {
    if (window.ethereum) {
      console.log("Metamask is installed");
      setEthereumWindow(window.ethereum);
    }

    if (ethereumWindow) {
      const accountsArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      setConnectedAccounts(accountsArray[0]);
      console.log(accountsArray[0]);
    }
    connectToMetamaskWallet();
  };

  const connectToMetamaskWallet = async () => {
    if (window.ethereum) {
      const allAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedAccounts(allAccounts[0]);
    }

    // connectToMetamaskWallet();
  };

  const connectToContractInstance = async () => {
    try {
      console.log(contractABI);

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      // Create a new instance of the contract with the signer
      const contract = new ethers.Contract(
        contractInstance,
        contractABI,
        signer
      );
      setMedicalContract(contract);
      console.log(contract);
    } catch (error) {
      console.error("User rejected the request:", error);
    }
  };

  const alreadyBought = async () => {
    try {
      const URIBoughtNFT = await medicalContract.getMintedNFT();

      const result = await IpfsToArray(URIBoughtNFT);

      setMintedNft(result);
      console.log("The result is : " + result.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getImage = (ipfsURL) => {
    const hash = ipfsURL.split("ipfs://")[1];
    return `https://ipfs.io/ipfs/${hash}`;
  };

  useEffect(() => {
    connectToContractInstance();
  }, []);

  if (mintedNFT == undefined) {
    alreadyBought();
  }

  return (
    <div className="bg-black font-myFont">
      {/* <div className="absolute inset-20 mt-20 rounded-xl bg-gray-800">
        <div className=" relative  h-9/12 rounded-xl mx-10 mt-10 flex gap-x-5"> */}
      <div className="absolute inset-0 mt-24 col-start-1 col-end-4 bg-opacity-90 p-10 justify-center space-x-8 space-y-5">
        <div className="text-2xl bolder flex justify-center mb-5 ">
          <p className="bg-yellow-400 to-indigo-600 bg-clip-text text-transparent px-10 text-5xl font-bold">
            Your NFTs
          </p>
        </div>

        {mintedNFT != undefined && mintedNFT.length != 0 ? (
          mintedNFT.map((eachNFT, index) => (
            <BoughtCard
              key={index}
              itemName={eachNFT.name}
              itemDescription={eachNFT.description}
              itemSrc={getImage(eachNFT.image)}
              itemPrice={eachNFT.price}
              // onClick={() => setZoomIndex(index)}
              index={index}
            />
          ))
        ) : (
          <div className="text-yellow-400 text-center flex text-[16rem]">
            No Bought NFT
          </div>
        )}
      </div>
    </div>
  );
}
