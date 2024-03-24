import { useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

//components
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";

//hooks
import { useAuth } from "../hooks/useAuth";

export const LoginCard = () => {
  const buttonRef = useRef(null);
  const { isRegistering, handleLogin, handleRegister } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const oldText = buttonRef.current.innerText;
    console.log(data);
    buttonRef.current.disabled = true;
    buttonRef.current.innerText = "Wait...";

    try {
      if (isRegistering) {
        await handleRegister(data);
      } else {
        await handleLogin(data);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      buttonRef.current.disabled = false;
      buttonRef.current.innerText = oldText;
    }
  };

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      rounded={"lg"}
      bg={"gray.800"}
      boxShadow={"lg"}
      p={8}
    >
      <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
        {isRegistering ? (
          <>
            <FormControl
              as={motion.div}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              id="username"
            >
              <FormLabel color={"white"}>Username</FormLabel>
              <Input
                type="text"
                color={"white"}
                {...register("username", { required: true })}
                sx={{ borderColor: `${errors.email ? "red.300" : "white"}` }}
              />
            </FormControl>
            {errors.username && (
              <Text
                as={motion.p}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                fontSize={"sm"}
                color={"red.300"}
              >
                This field is required
              </Text>
            )}
          </>
        ) : null}

        <FormControl id="email">
          <FormLabel color={"white"}>Email address</FormLabel>
          <Input
            type="email"
            {...register("email", { required: true })}
            color={"white"}
            sx={{ borderColor: `${errors.email ? "red.300" : "white"}` }}
          />
        </FormControl>
        {errors.email && (
          <Text
            as={motion.p}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            fontSize={"sm"}
            color={"red.300"}
          >
            This field is required
          </Text>
        )}
        <Stack spacing={10}>
          <Stack
            direction={{ base: "column", sm: "row" }}
            align={"start"}
            justify={"space-between"}
          >
            {!isRegistering ? (
              <Text color={"white"}>
                Don&apos;t have an account?{" "}
                <Link color={"#34D07C"} href="/auth/signup">
                  Sign up
                </Link>
              </Text>
            ) : (
              <Text color={"white"}>
                Already have an account?{" "}
                <Link color={"#34D07C"} href="/auth">
                  Sign in
                </Link>
              </Text>
            )}
          </Stack>
          <Button
            ref={buttonRef}
            type="submit"
            bg={"#34D07C"}
            color={"white"}
            _hover={{
              bg: "#2C9F5C",
            }}
          >
            {isRegistering ? "Sign up" : "Sign in"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
