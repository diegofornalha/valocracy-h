import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  HStack,
  Image,
  Badge,
} from "@chakra-ui/react";

export const NftCard = ({ nftData }) => {
  console.log(nftData);

  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        w={"full"}
        bg={useColorModeValue("gray.800", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
        _groupHover={{
          scale: 1.5,
        }}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"full"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${nftData.image_url})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={"full"}
            width={"full"}
            objectFit={"cover"}
            src={nftData.image_url}
            alt="#"
            _groupHover={{
              scale: 1.5,
            }}
          />
        </Box>
        <Box width="full" pt={8} display={"flex"} justifyContent={"end"}>
          <HStack>
            {nftData.is_claimed ? (
              <Badge
                py={1}
                px={{ base: 2, md: 3 }}
                rounded={"full"}
                // variant={"solid"}
                bg={"red"}
                fontSize={"sm"}
                textTransform={"uppercase"}
              >
                Claimed
              </Badge>
            ) : (
              <></>
            )}
            <Badge
              py={1}
              px={{ base: 2, md: 3 }}
              rounded={"full"}
              // variant={"solid"}
              fontSize={"sm"}
              textTransform={"uppercase"}
            >
              {nftData.rarity_name}
            </Badge>
          </HStack>
        </Box>
        <Stack pt={10} align={"start"}>
          <Heading
            color={"gray.100"}
            fontSize={"1xl"}
            fontFamily={"body"}
            fontWeight={500}
          >
            {nftData.title}
          </Heading>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Text color={"gray.100"} fontWeight={800} fontSize={"xl"}>
              Economy:
            </Text>
            <Text color={"gray.500"}>
              {nftData.economy.power} (${nftData.economy.share.toFixed(2)})
            </Text>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center">
            <Text color={"gray.100"} fontWeight={800} fontSize={"xl"}>
              Governance:
            </Text>
            <Text color={"gray.500"}>
              {nftData.governance.power} ({nftData.governance.relative_power}%)
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};
