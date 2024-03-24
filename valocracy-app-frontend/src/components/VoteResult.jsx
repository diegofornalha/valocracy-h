import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export const VoteResult = ({ votes, title }) => {
  return (
    <TableContainer>
      <Table variant="simple" size={"lg"} w={"full"}>
        <TableCaption>Results for {title}</TableCaption>
        <Thead w={"full"}>
          <Tr>
            <Th>username</Th>
            <Th>vote</Th>
            <Th isNumeric>percentage</Th>
          </Tr>
        </Thead>
        <Tbody w={"full"}>
          {votes.map((vote, id) => {
            return (
              <Tr key={id}>
                <Td>{vote.username}</Td>
                <Td>{vote.answer}</Td>
                <Td isNumeric>{vote.relative_power}</Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>username</Th>
            <Th>vote</Th>
            <Th isNumeric>percentage</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
