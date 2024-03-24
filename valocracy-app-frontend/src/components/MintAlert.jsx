import { Box, Heading, Text } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export const MintAlert = ({ walletAccount }) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {!walletAccount
          ? "You don't have a connected wallet"
          : "Only the Valocracy portfolio can Mint an NFT"}
      </Heading>
      <Text color={"gray.500"}>
        {!walletAccount
          ? "Connect your wallet, if it's the Valocracy wallet you'll be able to do the NFT Mint"
          : "Your wallet does not have the credentials to perform the NFT Mint, please connect the Valocracy wallet to proceed"}
      </Text>
    </Box>
  );
};
