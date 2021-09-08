import type { NextPage } from "next";
import {
  Container,
  Text,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const Coin: NextPage = () => {
  return (
    <Container maxW="container.xl" centerContent>
      <Text as="h1" fontSize="3xl" fontWeight="bold" my={8}>
        Coins Info
      </Text>
      <Table variant="simple">
        <TableCaption>Coins stats in realtime</TableCaption>
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Last Price</Th>
            <Th>24H % Change</Th>
            <Th>Total Volume</Th>
            <Th>Market Cap</Th>
          </Tr>
        </Thead>
        <Tbody></Tbody>
      </Table>
    </Container>
  );
};

export default Coin;
