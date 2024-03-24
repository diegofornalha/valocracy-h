import { useRef, useState } from "react";
import toast from "react-hot-toast";

//components
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useRadioGroup,
} from "@chakra-ui/react";
import { RadioCard } from "./RadioCard";

//enum
import { ProposalVoteEnum } from "../enum/ProposalVoteEnum";

//hooks
import { useLoading } from "../hooks/useLoading";

//api
import governanceApi from "../api/governance";
import { useModal } from "../hooks/useModal";

export const VoteModal = ({ title, proposalId }) => {
  const { showBackdrop, hideBackdrop } = useLoading();
  const { isOpen, onOpen, onClose } = useModal();
  const [vote, setVote] = useState(null);
  const finalRef = useRef(null);
  const options = Object.keys(ProposalVoteEnum);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    onChange: setVote,
  });

  const group = getRootProps();

  const handleSubmit = async () => {
    showBackdrop();
    console.log(vote);

    try {
      const response = await governanceApi.proposalVote(proposalId, vote);
      console.log(response);
      if (response.vote_id) {
        toast.success("Vote Counted");
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    } finally {
      hideBackdrop();
    }
  };

  return (
    <>
      <Button mt={4} onClick={onOpen}>
        Vote
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Vote</Text>
            <VStack py={8} {...group}>
              {options.map((value) => {
                const radio = getRadioProps({ value });
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!vote}
              onClick={handleSubmit}
              width={"full"}
              variant="outline"
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
