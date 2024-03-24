//components
import { Image, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

//hooks
import { useLoading } from "../hooks/useLoading";

export const Backdrop = () => {
  const { isOpen } = useLoading();

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent background="none">
        <div className="relative w-full h-full flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#34D07C]"></div>
          <Image
            src="/valocracy-logo-2.png"
            className="rounded-full h-28 w-28"
          />
        </div>
      </ModalContent>
    </Modal>
  );
};
