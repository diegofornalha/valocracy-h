import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
  Button,
  Stack,
  Flex,
} from "@chakra-ui/react";

import { BsThreeDots } from "react-icons/bs";
import { RiShutDownLine, RiRestartLine } from "react-icons/ri";

import { useAuth } from "../hooks/useAuth";

export const UserOptions = () => {
  const { logout } = useAuth();
  return (
    /**
     * You may move the Popover outside Flex.
     */
    <Flex justifyContent="center" mt={4}>
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          <IconButton
            bg="transparent"
            color={"gray.100"}
            aria-label="More server options"
            icon={<BsThreeDots />}
            variant="solid"
            w="fit-content"
            _hover={{ color: "white", bg: "#34D07C" }}
          />
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
          <PopoverArrow />
          <PopoverBody>
            <Stack>
              <Button
                w="194px"
                variant="ghost"
                rightIcon={<RiRestartLine />}
                justifyContent="space-between"
                fontWeight="normal"
                colorScheme="red"
                fontSize="sm"
              >
                Restart Server
              </Button>
              <Button
                w="194px"
                variant="ghost"
                rightIcon={<RiShutDownLine />}
                justifyContent="space-between"
                fontWeight="normal"
                colorScheme="red"
                fontSize="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
