import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Image,
  Link,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import metamaskApi from "../api/metamask";
import { useWallet } from "../hooks/useWallet";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useModal } from "../hooks/useModal";

export const Navbar = () => {
  const { isOpen, onToggle } = useModal();
  const { connect, isConnected, walletAccount } = useWallet();
  const { user } = useAuth();

  const connectWallet = async () => {
    const walletConnected = await connect();
    const userWalletExist = Boolean(user?.id) && Boolean(user?.metamask);

    if (!userWalletExist && walletConnected.length > 0)
      await metamaskApi.create(walletConnected);
  };

  const maxLength = (str, length = 25) => {
    if (str.length > length) {
      const shortenedStr = str.slice(0, length) + " ...";
      return shortenedStr;
    }

    return str;
  };

  return (
    <Box>
      <Flex
        bg={"gray.800"}
        color={useColorModeValue("gray.600", "white")}
        minH={"100px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            _hover={{ bg: "#34D07C" }}
            onClick={onToggle}
            icon={
              isOpen ? (
                <CloseIcon w={3} h={3} color={"white"} />
              ) : (
                <HamburgerIcon color={"white"} w={5} h={5} />
              )
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "space-between" }}
          alignItems={"center"}
        >
          <Image
            src="/valocracy-logo-3.png"
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            width={{ base: "50px", md: "60px" }}
          />

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        {isConnected ? (
          <Stack
            flex={{ base: 1, md: 0 }}
            ml={{ base: 0, md: 12 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
          >
            <Button
              as={"a"}
              variant={"outline"}
              fontSize={"lg"}
              fontWeight={600}
              borderColor={"#34D07C"}
              color={"#34D07C"}
              href={"#"}
              _hover={{
                bg: "#34D07C",
                color: "white",
              }}
            >
              <img
                style={{ height: "20px", marginRight: "5px" }}
                src="/metamask-icon.svg"
                alt="metamask"
              />
              {maxLength(walletAccount)}
            </Button>
          </Stack>
        ) : (
          <Stack
            flex={{ base: 1, md: 0 }}
            ml={{ base: 0, md: 12 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
          >
            <Button
              as={"a"}
              variant={"solid"}
              fontSize={"lg"}
              fontWeight={600}
              borderColor={"#34D07C"}
              color={"#34D07C"}
              href={"#"}
              _hover={{
                bg: "#34D07C",
                color: "white",
              }}
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen}>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue("white", "gray.200");
  const linkHoverColor = useColorModeValue("#34D07C", "white");
  const popoverContentBgColor = useColorModeValue("#34D07C", "gray.800");
  const redirect = useNavigate();

  return (
    <Stack direction={"row"} spacing={4} alignItems={"center"}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                as="a"
                p={2}
                onClick={() => {
                  redirect(navItem.href);
                }}
                cursor="pointer"
                fontSize={"lg"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
      <Link
        as="a"
        p={2}
        href="https://near.org/177240d7728484e7a3878fdcd8557e89fd87a4350f45d5de9f7ab0dc0e2400c8/widget/valocracy.components.chat"
        cursor="pointer"
        target="_blank"
        fontSize={"lg"}
        fontWeight={500}
        color={linkColor}
        _hover={{
          textDecoration: "none",
          color: linkHoverColor,
        }}
      >
        AI Chat
      </Link>
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("#267D4D", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            color={"gray.100"}
            _groupHover={{ color: "white" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text
            fontSize={"sm"}
            color={"gray.100"}
            _groupHover={{ color: "white" }}
          >
            {subLabel}
          </Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"white"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("#34D07C", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={useColorModeValue("white", "gray.200")}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            color={"white"}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box
                as="a"
                key={child.label}
                py={2}
                href={child.href}
                color={"white"}
              >
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "My NFT's",
    href: "/",
  },
  {
    label: "All NFT's",
    href: "/all",
  },
  {
    label: "Mint",
    href: "/mint",
  },
  {
    label: "Governance",
    href: "/governance",
    // children: [
    //   {
    //     label: "Governance submenu 1",
    //     subLabel: "amet laborum adipisicing incididunt quis",
    //     href: "#",
    //   },
    //   {
    //     label: "Governance submenu 2",
    //     subLabel: "amet laborum adipisicing incididunt quis",
    //     href: "#",
    //   },
    // ],
  },
];
