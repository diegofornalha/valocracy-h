//components
import { Flex } from "@chakra-ui/react";
import { UserBar } from "../components/UserBar";
import { NftDashboard } from "../components/NftDashboard";
import NftModal from "../components/NftModal";
import { useState, useEffect } from "react";
import { useModal } from "../hooks/useModal";

const Home = () => {
  const { isOpen, onOpen, onClose } = useModal();
  const [nftModal, setNftModal] = useState(null);

  useEffect(() => {
    if (!nftModal) return;
    console.log("open");
    onOpen();
  }, [nftModal]);

  useEffect(() => {
    if (!isOpen) setNftModal(null);
  }, [isOpen]);

  return (
    <Flex
      flexDirection={"column"}
      justifyContent="start"
      alignItems="start"
      width="full"
      height="full"
    >
      <Flex
        width={"full"}
        height={{ base: "full", md: "20vh" }}
        flexDirection={"column"}
        alignItems={"start"}
        justify={"start"}
        p={{ base: 2, md: 4 }}
      >
        <UserBar />
      </Flex>
      <NftDashboard setNftModal={setNftModal} />
      <NftModal isOpen={isOpen} onClose={onClose} nft={nftModal} />
    </Flex>
  );
};

export default Home;
