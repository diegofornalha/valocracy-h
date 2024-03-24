import { useEffect, useState } from "react";
import { Divider, Grid, Heading, Stack } from "@chakra-ui/react";

//components
import { ProposalCard } from "../components/ProposalCard";

//api
import governanceApi from "../api/governance";

const Governance = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      const result = await governanceApi.getProposals();
      console.log(result);
      setProposals(result);
    };
    try {
      fetchProposals();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <Stack
        width="full"
        px={{
          base: 10,
          md: 40,
        }}
        py={10}
        alignItems={{
          base: "center",
          md: "start",
        }}
        justifyContent={"center"}
      >
        <Heading fontSize={"4xl"} color={"#34D07C"}>
          Proposals
        </Heading>
      </Stack>
      <Divider width="full" height={"2px"} bg={"#34D07C"} />
      <Grid
        width="full"
        templateColumns="repeat(2, 1fr)"
        gap={10}
        px={{
          base: 10,
          md: 40,
        }}
        py={10}
      >
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            title={proposal.title}
            status={proposal.status}
            openDate={proposal.openDate}
            governancePower={proposal.governance_power_balance}
            userPower={proposal.user_power}
            isVoted={proposal.answer === null ? false : true}
            id={proposal.id}
          />
        ))}
      </Grid>
    </>
  );
};

export default Governance;
