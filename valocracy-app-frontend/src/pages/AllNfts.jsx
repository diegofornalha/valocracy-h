import { ethers } from "ethers";
import { useValocracy } from "../hooks/useValocracy";
import ipfs from "../api/ipfs";
import { useEffect, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { NftSkeleton } from "../components/NftSkeleton";
import { NftCard } from "../components/NftCard";
import { EmptyNft } from "../components/EmptyNft";
import effortApi from "../api/effort";

const fetchApiEffortDataByIpfs = async (ipfsData) => {
  const effortApiData = await effortApi.get(ipfsData.id);

  return { ...effortApiData, image_url: ipfsData.image };
};

const AllNfts = () => {
  const [nfts, setNfts] = useState([]);
  const { contractValocracyNFT } = useValocracy();
  const [loading, setLoading] = useState(false);

  const allNfts = async () => {
    setLoading(true);
    const contract = contractValocracyNFT();

    try {
      const txn = await contract.suply();
      const bigNumber = ethers.BigNumber.from(txn);
      const number = bigNumber.toNumber();
      const nftsIPFS = [];

      for (let i = 0; i < number; i++) {
        const nft = await contract.tokenURI(i + 1);
        // Aqui você pode adicionar mais lógica para buscar metadados do token ou qualquer outra informação necessária
        nftsIPFS.push(nft);
      }

      const result = await ipfs.fetchImages(nftsIPFS);
      const nftsInfo = await Promise.all(result.map(fetchApiEffortDataByIpfs));
      console.log("LABEL", nftsInfo);
      setNfts(nftsInfo);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allNfts();
  }, []);

  return (
    <>
      {loading ? (
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={{ base: 2, md: 8 }}
          width="full"
          p={{ base: 2, md: 4 }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <NftSkeleton key={i} /> // Adjust this component as needed
          ))}
        </Grid>
      ) : nfts.length ? (
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={{ base: 2, md: 8 }}
          width="full"
          p={{ base: 2, md: 4 }}
        >
          {nfts.map((nft, i) => (
            <div key={i}>
              <NftCard nftData={nft} />
            </div>
          ))}
        </Grid>
      ) : (
        <Box w="full" h="full" mt={4}>
          <EmptyNft />
        </Box>
      )}
    </>
  );
};

export default AllNfts;
