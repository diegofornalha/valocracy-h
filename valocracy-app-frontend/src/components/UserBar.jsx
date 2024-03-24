import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";

//components
import { AvatarCircle } from "./AvatarCircle";
import { UserOptions } from "./UserOptions";

//hooks
import { useAuth } from "../hooks/useAuth";
import { StatsCard } from "./StatsCard";
import { useWallet } from "../hooks/useWallet";

export const UserBar = () => {
  const { user } = useAuth();
  const { walletAccount } = useWallet();

  return (
    <Flex
      width="full"
      flexDirection={{ base: "column", lg: "row" }}
      justifyContent="space-around"
      alignItems="center"
    >
      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        justifyContent={{ base: "center", lg: "start" }}
        alignItems={{ base: "center", lg: "start" }}
        width={"50%"}
      >
        <AvatarCircle />
        <VStack alignItems={"start"}>
          <Heading
            fontSize={{ base: "16px", md: "18px" }}
            fontFamily={"body"}
            color={"white"}
            pt={{ base: 4, md: 6 }}
          >
            Hello {user?.username} 👋
          </Heading>
          <Text sx={{ display: "flex" }} fontSize={"sm"} color={"gray.400"}>
            {user?.email}
          </Text>
          <Text sx={{ display: "flex" }} fontSize={"sm"} color={"gray.400"}>
            {walletAccount}
          </Text>
        </VStack>
        <Box ml={2}>
          <UserOptions />
        </Box>
      </Flex>
      <StatsCard />
    </Flex>
  );
};
