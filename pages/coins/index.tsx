import type { NextPage } from "next";
import type { Coin } from "../../types/type";
import NextImage from "next/image";
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
  HStack,
} from "@chakra-ui/react";
import { useQuery } from "react-query";

// import helpers function
import {
  formatNumber,
  convertToIdr,
  stylePercentage,
} from "../../utils/helpers";
import getCoins from "../../utils/getCoins";

const Coins: NextPage = () => {
  const { data, isSuccess, isError, isFetching, isLoading } = useQuery(
    "coins",
    getCoins
  );

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
        <Tbody>
          {isSuccess &&
            data.map((coin: Coin) => {
              return (
                <Tr key={coin.id}>
                  <Td>
                    <HStack>
                      <NextImage
                        src={coin.image}
                        alt={`${coin.name} Logo`}
                        width={24}
                        height={24}
                      />
                      <Text>{coin.name}</Text>
                    </HStack>
                  </Td>
                  <Td>{convertToIdr(coin.current_price)}</Td>
                  <Td
                    color={
                      stylePercentage(coin.price_change_percentage_24h)
                        ? "green.500"
                        : "red.500"
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)} %
                  </Td>
                  <Td>{formatNumber(coin.total_volume)}</Td>
                  <Td>{formatNumber(coin.market_cap)}</Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Coins;
