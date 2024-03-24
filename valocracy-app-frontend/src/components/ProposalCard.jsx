import { useNavigate } from "react-router-dom";

//components
import {
  Box,
  VStack,
  HStack,
  Text,
  Tag,
  TagLabel,
  useColorModeValue,
  Divider,
  Center,
} from "@chakra-ui/react";

//utils
import utils from "../helpers/utils";

export const ProposalCard = ({
  isVoted,
  status,
  title,
  governancePower,
  userPower,
  openDate,
  id,
}) => {
  const cardBg = useColorModeValue("gray.700", "gray.700");
  const tagColorScheme = isVoted ? "green" : "red";
  const navigate = useNavigate();

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      p={4}
      boxShadow="2xl"
      borderWidth="1px"
      width="full"
      onClick={() => navigate(`/governance/proposal/${id}`)}
      sx={{
        cursor: "pointer",
        transition: "all .3s ease",
        _hover: {
          transform: "scale(1.05)",
        },
      }}
    >
      <HStack justify={"space-between"}>
        <VStack align="stretch">
          <HStack>
            <Tag size="md" borderRadius="md" colorScheme={tagColorScheme}>
              <TagLabel>{isVoted ? "Voted" : "Not Voted"}</TagLabel>
            </Tag>
            <Tag
              size="md"
              borderRadius="md"
              colorScheme={utils.getStatusColor(status)}
            >
              <TagLabel>{status}</TagLabel>
            </Tag>
          </HStack>
          <Text fontWeight="bold" fontSize="lg" color={"white"}>
            {title}
          </Text>
          <Text fontWeight="bold" fontSize="lg" color={"white"}>
            {openDate}
          </Text>
        </VStack>
        <HStack
          borderRadius="xl"
          p={4}
          bg={"gray.800"}
          justifyContent={"center"}
        >
          <VStack>
            <Text color={"white"} fontWeight={"bold"} fontSize={"xs"}>
              Community Gov. Points
            </Text>
            <Text color={"white"} fontSize={"lg"}>
              {governancePower}
            </Text>
          </VStack>
          <Center height="50px" px={2}>
            <Divider orientation="vertical" />
          </Center>
          <VStack>
            <Text color={"white"} fontWeight={"bold"} fontSize={"xs"}>
              My Points
            </Text>
            <Text color={"white"} fontSize={"lg"}>
              {userPower ? userPower : "--"}
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Box>
  );
};
