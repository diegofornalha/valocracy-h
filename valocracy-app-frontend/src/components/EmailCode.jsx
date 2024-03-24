import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

//components
import { Center, Heading, Text, useControllableState } from "@chakra-ui/react";
import { Button, FormControl, Stack, HStack } from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";

//hooks
import { useAuth } from "../hooks/useAuth";
import { useLoading } from "../hooks/useLoading";

export const EmailCode = () => {
  const { email, emailCodeId, validateCode, handleResendCode } = useAuth();
  const { showBackdrop, hideBackdrop } = useLoading();
  const [resendCode, setResendCode] = useState(false);
  const submitBtnRef = useRef(null);

  // use chakra ui to control the code value https://chakra-ui.com/docs/hooks/use-controllable
  const [codeValue, setCodeValue] = useControllableState({ defaultValue: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    showBackdrop();

    console.log(codeValue);
    console.log(emailCodeId);

    try {
      await validateCode(emailCodeId, codeValue);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      hideBackdrop();
      setCodeValue("");
    }
  };

  const handleChange = (e) => {
    setCodeValue((prevCode) => prevCode + e.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      setResendCode(true);
    }, 60000);
  }, []);

  return (
    <Stack
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      spacing={4}
      w={"full"}
      maxW={"lg"}
      bg={"gray.800"}
      rounded={"xl"}
      boxShadow={"lg"}
      p={6}
      my={10}
    >
      <Center>
        <Heading
          lineHeight={1.1}
          fontSize={{ base: "2xl", md: "3xl" }}
          fontFamily={"sans-serif"}
          color={"white"}
        >
          Verify your Email
        </Heading>
      </Center>
      <Center fontSize={{ base: "sm" }} color={"white"}>
        We have sent code to your email
      </Center>
      <Center
        fontSize={{ base: "sm", sm: "md" }}
        fontWeight="bold"
        color={"white"}
        mt={4}
      >
        {email}
      </Center>
      <Stack as="form" onSubmit={handleSubmit} spacing={4}>
        <FormControl>
          <Center>
            <HStack>
              <PinInput type="alphanumeric" otp>
                <PinInputField color={"white"} onChange={handleChange} />
                <PinInputField color={"white"} onChange={handleChange} />
                <PinInputField color={"white"} onChange={handleChange} />
                <PinInputField color={"white"} onChange={handleChange} />
                <PinInputField color={"white"} onChange={handleChange} />
                <PinInputField color={"white"} onChange={handleChange} />
                <PinInputField color={"white"} onChange={handleChange} />
                <PinInputField color={"white"} onChange={handleChange} />
              </PinInput>
            </HStack>
            {/* {errors.code && (
              <Text
                as={motion.p}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                fontSize={"sm"}
                color={"red.300"}
              >
                This field is required
              </Text>
            )} */}
          </Center>
        </FormControl>
        <Stack spacing={6} mt={2}>
          <Text color={"white"}>
            Don&apos;t receive your code?{" "}
            <Button
              as="button"
              variant={"link"}
              disabled={resendCode}
              color={"#34D07C"}
              onClick={handleResendCode}
            >
              Resend
            </Button>
          </Text>
        </Stack>
        <Stack spacing={6} mt={2}>
          <Button
            ref={submitBtnRef}
            type="submit"
            bg={"#34D07C"}
            color={"white"}
            _hover={{
              bg: "#2C9F5C",
            }}
          >
            Verify
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
