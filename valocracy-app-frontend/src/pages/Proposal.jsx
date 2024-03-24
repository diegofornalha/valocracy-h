import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { convertToBrazilianDateFormat } from "../helpers/utils";

//components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Box,
  HStack,
  Heading,
  Stack,
  Tag,
  TagLabel,
  Text,
  Divider,
  VStack,
  Badge,
  Center,
} from "@chakra-ui/react";
import { VoteModal } from "../components/VoteModal";

//api
import governanceApi from "../api/governance";
import utils from "../helpers/utils";
import { VoteResult } from "../components/VoteResult";
import { ProposalSkeleton } from "../components/ProposalSkeleton";

const Proposal = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const [proposal, setProposal] = useState({});
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProposal = async () => {
      const result = await governanceApi.getProposalById(id);
      const getVotes = await governanceApi.getProposalVotes(id);
      setProposal(result);
      setVotes(getVotes);
      console.log(result);
      console.log(getVotes);
      setLoading(false);
    };

    try {
      fetchProposal();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading) {
    return (
      <Container>
        <ProposalSkeleton />
      </Container>
    );
  }

  return (
    <Container
      p={8}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        flexDir: "column",
      }}
    >
      <Stack minW={"100%"} pb={8}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/governance">Governance</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Proposal #{id}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Stack>

      <Button
        onClick={() => {
          navigate("/governance");
        }}
        size={"sm"}
        leftIcon={<IoReturnUpBack />}
        mb={8}
      >
        Back
      </Button>

      <HStack pb={12}>
        <Tag
          size="lg"
          borderRadius="md"
          colorScheme={proposal.answer !== null ? "green" : "red"}
        >
          <TagLabel>
            {proposal.answer !== null ? "Voted" : "Not Voted"}
          </TagLabel>
        </Tag>
        <Tag
          size="lg"
          borderRadius="md"
          colorScheme={utils.getStatusColor(proposal.status)}
        >
          <TagLabel>{proposal.status}</TagLabel>
        </Tag>
      </HStack>
      <Stack w={"full"}>
        <Heading as="h1" size="2xl">
          {proposal.title}
        </Heading>
      </Stack>
      <Box bg={"#151517"} w={"full"} p={8} rounded={"lg"} mt={8}>
        <HStack justify={"space-between"}>
          <Box>
            <Text>Voting Starts</Text>
            <Text>{convertToBrazilianDateFormat(proposal.reg_date)}</Text>
          </Box>
          <Box>
            {proposal.answer !== null && (
              <HStack py={4}>
                <Text>You Voted</Text>
                <Badge px={2} py={1}>
                  {proposal.answer}
                </Badge>
              </HStack>
            )}
            {proposal.status !== "OPEN" || proposal.answer !== null ? (
              <Button isDisabled>Vote Closed</Button>
            ) : (
              <VoteModal title={proposal.title} proposalId={proposal.id} />
            )}
          </Box>
        </HStack>
      </Box>
      <Divider mt={8} />
      {proposal.status !== "OPEN" && (
        <>
          <VStack mt={8} align={"start"}>
            <Heading>Results</Heading>
          </VStack>
          <Center w={"full"} py={8}>
            <VoteResult votes={votes} title={proposal.title} />
          </Center>
        </>
      )}
    </Container>
  );
};

export default Proposal;
