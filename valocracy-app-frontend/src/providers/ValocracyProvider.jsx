import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useWallet } from "../hooks/useWallet";
import ipfsApi from "../api/ipfs";
import ValocracyContext from "../contexts/ValocracyContext";
import economyApi from "../api/economy";
import governanceApi from "../api/governance";
import valocracy from "../helpers/.valocracy.abi.json";
import effortApi from "../api/effort";

const contractValocracyNFT = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    valocracy.abi,
    signer
  );

  return contract;
};

const fetchApiEffortDataByIpfs = async (ipfsData) => {
  const effortApiData = await effortApi.get(ipfsData.id);

  return { ...effortApiData, image_url: ipfsData.image };
};

export const ValocracyProvider = ({ children }) => {
  const { walletAccount } = useWallet();
  const [userEconomyInfo, setUserEconomyInfo] = useState(null);
  const [userGovernanceInfo, setGovernanceInfo] = useState(null);
  const [nftsInfo, setNftsInfos] = useState([]);
  const [loading, setLoading] = useState(false);

  const syncInfos = async () => {
    try {
      if (walletAccount.length > 0) {
        const economyShare = await economyApi.fetchMyShare();
        const governanceShare = await governanceApi.fetchMyShare();

        setUserEconomyInfo(economyShare);
        setGovernanceInfo(governanceShare);
      } else {
        setUserEconomyInfo(null);
        setGovernanceInfo(null);
      }
    } catch (err) {
      toast.error("Erro ao sincronizar dados da valocracia");
    }
  };

  const syncNFTs = async () => {
    setLoading(true);
    try {
      if (walletAccount.length > 0) {
        const contract = contractValocracyNFT();

        const txn = await contract.tokensOfOwner(walletAccount);

        let NFTsIds = txn.map((e) => {
          const bigNumber = ethers.BigNumber.from(e);
          const number = bigNumber.toNumber();
          return number;
        });

        NFTsIds = NFTsIds.map(async (e) => {
          const nft = await contract.tokenURI(e);
          return nft;
        });

        const ipfs = await Promise.all(NFTsIds);
        const ipfsNftsData = await ipfsApi.fetchImages(ipfs);

        const nftsInfo = await Promise.all(
          ipfsNftsData.map(fetchApiEffortDataByIpfs)
        );
        setNftsInfos(nftsInfo);
        // console.log(nftsInfo);
      } else {
        setNftsInfos([]);
      }
    } catch (error) {
      console.error("Error catch", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      console.log("walletAccount", walletAccount);
      syncInfos();
      syncNFTs();
    })();
  }, [walletAccount]);

  return (
    <ValocracyContext.Provider
      value={{
        userEconomyInfo,
        userGovernanceInfo,
        nftsInfo,
        contractValocracyNFT,
        loading,
      }}
    >
      {children}
    </ValocracyContext.Provider>
  );
};
