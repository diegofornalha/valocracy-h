import { Box, Grid } from "@chakra-ui/react";
import { NftCard } from "./NftCard";
import { useValocracy } from "../hooks/useValocracy";
import { EmptyNft } from "./EmptyNft";
import { NftSkeleton } from "./NftSkeleton";

export const NftDashboard = ({ setNftModal }) => {
  const { nftsInfo, loading } = useValocracy();

  const clickNFT = (nft) => {
    setNftModal(nft);
  };

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
      ) : nftsInfo.length ? (
        <Grid
          templateColumns="repeat(4, 1fr)"
          gap={{ base: 2, md: 8 }}
          width="full"
          p={{ base: 2, md: 4 }}
        >
          {nftsInfo.map((nft, i) => (
            <div key={i} onClick={() => clickNFT(nft)}>
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
