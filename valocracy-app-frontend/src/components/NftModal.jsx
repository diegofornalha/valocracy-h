import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  HStack,
  Image,
  Badge,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import { claimEffort } from "../api/economy";
import { convertToBrazilianDateFormat } from "../helpers/utils";
import { FiExternalLink } from "react-icons/fi";
import { useLoading } from "../hooks/useLoading";

function NftModal({ isOpen, onClose, nft }) {
  const { showBackdrop, hideBackdrop } = useLoading();

  const claim = async (effort_id) => {
    onClose();
    showBackdrop();

    const response = await claimEffort(effort_id);
    console.log("claimEffort", { response });

    hideBackdrop();
    window.location.reload();
  };

  return (
    <>
      {nft && (
        <Modal
          sx={{ borderRadius: "4px 4px 0 0" }}
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <Center py={0}>
              <Box
                sx={{ borderRadius: "4px 4px 0 0" }}
                role={"group"}
                p={15}
                w={"full"}
                h={"full"}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={useColorModeValue("gray.800", "gray.800")}
                boxShadow={"2xl"}
                rounded={"lg"}
                pos={"relative"}
                zIndex={1}
                _groupHover={{
                  scale: 1.5,
                }}
              >
                <ModalCloseButton zIndex={10000} />
                <Box
                  rounded={"lg"}
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
                    backgroundImage: `url(${nft.image_url})`,
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
                    height={"300px"}
                    width={"full"}
                    objectFit={"contain"}
                    src={nft.image_url}
                    alt="#"
                    _groupHover={{
                      scale: 1.5,
                    }}
                  />
                </Box>
                <Box width="full" display={"flex"} justifyContent={"center"}>
                  <HStack>
                    {nft.is_claimed ? (
                      <Badge
                        bg={"red"}
                        rounded={"full"}
                        variant={"solid"}
                        px={2}
                        py={1}
                        mt={4}
                        fontSize={"sm"}
                        textTransform={"uppercase"}
                      >
                        Claimed
                      </Badge>
                    ) : (
                      <></>
                    )}
                    <Badge
                      rounded={"full"}
                      px={2}
                      py={1}
                      mt={4}
                      variant={"solid"}
                      bg={"#29a663"}
                      fontSize={"sm"}
                      textTransform={"uppercase"}
                    >
                      {nft.rarity_name}
                    </Badge>
                  </HStack>
                </Box>
                <br></br>
                <Stack pt={0} align={"center"}>
                  <Heading
                    color={"gray.100"}
                    fontSize={"2xl"}
                    fontFamily={"body"}
                    fontWeight={500}
                  >
                    {nft.title}
                  </Heading>
                </Stack>
                <HStack
                  sx={{
                    padding: "18px 0",
                  }}
                  justifyContent="flex-end"
                >
                  {nft.is_claimed && (
                    <Badge
                      sx={{
                        padding: "2px 0",
                      }}
                      rounded={"full"}
                      // variant={"solid"}
                      fontSize={"sm"}
                      textTransform={"uppercase"}
                      width="94px"
                    >
                      <Stack
                        direction="row"
                        width="84px"
                        as="a"
                        href={`https://sepolia.scrollscan.com/tx/${nft.claim_transaction_hash}`}
                        target="_blank"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <FiExternalLink />
                        <Text>CLAIM</Text>
                      </Stack>
                    </Badge>
                  )}
                  <Badge
                    sx={{
                      padding: "2px 0",
                    }}
                    rounded={"full"}
                    // variant={"solid"}
                    fontSize={"sm"}
                    textTransform={"uppercase"}
                    width="94px"
                  >
                    <Stack
                      direction="row"
                      width="84px"
                      as="a"
                      href={`https://sepolia.scrollscan.com/tx/${nft.mint_transaction_hash}`}
                      target="_blank"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FiExternalLink />
                      <Text>MINT</Text>
                    </Stack>
                  </Badge>
                </HStack>
                <Box>
                  <Stack direction="row" alignItems="center">
                    <Text color={"gray.100"} fontWeight={800} fontSize={"xl"}>
                      Economy:
                    </Text>
                    <Text color={"gray.500"}>
                      {nft.economy.power} (${nft.economy.share.toFixed(2)})
                    </Text>
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Text color={"gray.100"} fontWeight={800} fontSize={"xl"}>
                      Governance:
                    </Text>
                    <Text color={"gray.500"}>
                      {nft.governance.power} ({nft.governance.relative_power}%)
                    </Text>
                  </Stack>

                  {nft.is_claimed ? (
                    <Stack>
                      <div>
                        <Text
                          color={"gray.100"}
                          fontWeight={800}
                          fontSize={"xl"}
                        >
                          Claim
                        </Text>
                        <Text color={"gray.500"}>
                          Date: {convertToBrazilianDateFormat(nft.claim_date)}
                        </Text>
                        <Text color={"gray.500"}>
                          Claimed value: {nft.claimed_balance}
                        </Text>
                      </div>
                    </Stack>
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
            </Center>
            {!nft.is_claimed && (
              <Button
                sx={{ borderRadius: "0px 0px 4px 4px" }}
                onClick={() => claim(nft.id)}
                isDisabled={nft.is_claimed}
              >
                Claim
              </Button>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default NftModal;
