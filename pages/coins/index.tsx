// type import
import type { Coin, InitialCoinsProps } from "../../types/type";

// non-custom component import
import { useState } from "react";
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
  Spinner,
  Grid,
  Button,
} from "@chakra-ui/react";
import { useQuery, QueryClient, dehydrate } from "react-query";

// import helpers function
import {
  formatNumber,
  convertToIdr,
  stylePercentage,
} from "../../utils/helpers";
import getCoins from "../../utils/getCoins";

const Coins = () => {
  // state
  const [page, setPage] = useState(1);

  // useQuery react query
  const { data, isSuccess, isError, isFetching, isLoading } = useQuery(
    ["coins", page],
    () => getCoins(page),
    {
      staleTime: 3000, // ms
      refetchInterval: 5000,
      // initialData: initialData,
    }
  );

  return (
    <Container maxW="container.xl" centerContent>
      {isFetching && <Spinner position="fixed" size="md" top={10} right={10} />}
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
      <Grid w="full" templateColumns="70% 1fr auto 1fr" gap={8} my={10}>
        <div></div>
        <Button
          colorScheme="facebook"
          variant="outline"
          onClick={() => setPage((prevState) => prevState - 1)}
          disabled={page === 1 ? true : false}
        >
          Previous
        </Button>
        <div>{page}</div>
        <Button
          colorScheme="facebook"
          variant="outline"
          onClick={() => setPage((prevState) => prevState + 1)}
        >
          Next
        </Button>
      </Grid>
    </Container>
  );
};

// React Query SSR with initialData
// export async function getStaticProps() {
//   const initialData = await getCoins();

//   return { props: { initialData } };
// }

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["coins", 1], () => getCoins());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Coins;
