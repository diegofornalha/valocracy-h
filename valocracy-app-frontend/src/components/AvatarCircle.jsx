import { Avatar, AvatarBadge, Flex } from "@chakra-ui/react";

//hooks
import { useAuth } from "../hooks/useAuth";

export const AvatarCircle = () => {
  const { user } = useAuth();

  return (
    <Flex
      justifyContent="start"
      alignItems="start"
      h="150px"
      w="150px"
      overflow="hidden"
      p={{ base: 6 }}
    >
      <Avatar size={"xl"} name={user?.username} src="">
        <AvatarBadge boxSize="0.85em" bg="green.500" />
      </Avatar>
    </Flex>
  );
};
