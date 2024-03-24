import { Box, Text, Image, Divider, Stack, VStack } from "@chakra-ui/react";
import { useValocracy } from "../hooks/useValocracy";

export const StatsCard = () => {
  const { userEconomyInfo, userGovernanceInfo, nftsInfo } = useValocracy();

  return (
    <Stack
      direction="row"
      width="full"
      color="white"
      justifyContent="space-around"
      alignItems="center"
    >
      <Divider
        width="0.5px"
        border={0}
        height="80px"
        backgroundColor={"white"}
        orientation="vertical"
      />
      <Box display="flex" textAlign="center">
        <Image
          src="/economic-power.png"
          mr="4"
          w={{ base: 4, md: 10 }}
          h={{ base: 4, md: 10 }}
        />
        <VStack alignItems={"start"} justifyContent="start">
          <Text
            textAlign={"start"}
            fontSize={{ base: "sm", md: "lg" }}
            fontWeight={"bold"}
          >
            My Economic Points
          </Text>
          <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
            {userEconomyInfo
              ? `${
                  userEconomyInfo.power || "0"
                } ($${userEconomyInfo.share.toFixed(2)})`
              : "--"}
          </Text>
        </VStack>
      </Box>
      <Divider
        width="0.5px"
        border={0}
        height="80px"
        backgroundColor={"white"}
        orientation="vertical"
      />
      <Box textAlign="center" display="flex">
        <Image
          src="/governance-power.png"
          mr="4"
          w={{ base: 4, md: 10 }}
          h={{ base: 4, md: 10 }}
        />
        <VStack alignItems={"start"} justifyContent="start">
          <Text
            textAlign={"start"}
            fontSize={{ base: "sm", md: "lg" }}
            fontWeight={"bold"}
          >
            My Governance Points
          </Text>
          <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
            {userGovernanceInfo
              ? `${userGovernanceInfo.power || "0"} (${
                  userGovernanceInfo.relative_power
                }%)`
              : "--"}
          </Text>
        </VStack>
      </Box>
      <Divider
        width="0.5px"
        border={0}
        height="80px"
        backgroundColor={"white"}
        orientation="vertical"
      />
      <Box textAlign="center" display="flex">
        <Image
          src="/nft.png"
          mr="4"
          w={{ base: 4, md: 10 }}
          h={{ base: 4, md: 10 }}
        />
        <VStack alignItems={"start"} justifyContent="start">
          <Text
            textAlign={"start"}
            fontSize={{ base: "sm", md: "lg" }}
            fontWeight={"bold"}
          >
            Total NFTs
          </Text>
          <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
            {nftsInfo.length}
          </Text>
        </VStack>
      </Box>
      <Divider
        width="0.5px"
        border={0}
        height="80px"
        backgroundColor={"white"}
        orientation="vertical"
      />
    </Stack>
  );
};
