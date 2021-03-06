import type { NextPage } from "next";
import NextLink from "next/link";
import {
  Container,
  Text,
  ButtonGroup,
  Button,
  Center,
  VStack,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Container>
      <Text
        as="h1"
        fontSize="5xl"
        align="center"
        fontWeight="bold"
        casing="uppercase"
        mt="48"
      >
        Learning to use React Query
      </Text>
      <Center>
        <ButtonGroup colorScheme="blue" variant="outline" mt="8">
          <VStack spacing={8}>
            <Button>
              <NextLink href="/coins">Example with CoinGecko API</NextLink>
            </Button>
            <Button>Example of Mutation in React Query</Button>
          </VStack>
        </ButtonGroup>
      </Center>
    </Container>
  );
};

export default Home;
