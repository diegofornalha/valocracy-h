import { Navigate, Outlet, useLocation } from "react-router-dom";

//chakraUI
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";

//hooks
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if there was a route the user was trying to access before being redirected here
  const from = location.state?.from?.pathname || "/";
  // console.log("LOGIN: ", from);

  if (isAuthenticated) {
    // Redirect to the originally requested path or home ("/") if none is found
    return <Navigate to={from} replace />;
  }

  return (
    <Box width="full" height="100vh">
      <Flex
        justifyContent="center"
        alignItems="center"
        width="full"
        height="full"
      >
        <Flex
          minH={"100vh"}
          width={"full"}
          align={"center"}
          justify={"center"}
          bg={"#0B0616"}
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Stack align={"start"}>
              <Heading color={"#34D07C"}>Valocracy</Heading>
              <Text sx={{ display: "flex" }} fontSize={"lg"} color={"gray.400"}>
                A Web3 Solution for
                <Text mx={2} color={"#34D07C"}>
                  Next-Gen DAOs
                </Text>
                👋
              </Text>
            </Stack>
            <Outlet />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Login;