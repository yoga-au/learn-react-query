# React Query Learning Note

## Setup React Query

First thing to do install react-query, [Docs Link](https://react-query.tanstack.com/installation)

```
yarn add react-query

or

npm i react-query
```

After that, go to your project entry point. In this case (Next.js) the entry point is in `_app.tsx`.
Import `{ QueryClientProvider, QueryClient }` from react-query, wrap the entire app with `QueryClientProvider`.
Then pass a `QueryClient` to `client` props in `QueryClientProvide`.
To enable react query Devtools, we can import `ReactQueryDevtools` in put it inside `QueryClientProvider`.

```tsx
// Using Chakra UI
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
export default MyApp;
```

## useQuery hooks for fetching data

To fetch from an endpoint, we can use `useQuery` hooks from react-query. `useQuery` accept 2 required argument and 1 config argument.
The first argument is **query key** which is and identifier for each query so react-query can distinguish different query.
The second argument is **fetcher function**, the function need to return a `Promise`, you can use any library like `axios` or `fetch()` API.
**Note:** If you need to pass parameter to the **fetcher function**, you need to pass a anonymous function that call **fetcher function**
<br>

`useQuery` return an object with very useful properties, for the full list of the properties you can see it [here](https://react-query.tanstack.com/reference/useQuery) for more details.

```ts
// getCoins fetcher function
import axios from "axios";

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&per_page=10&page=1";

const getCoins = async () => {
  const response = axios.get(url);

  if ((await response).status === 400) {
    throw new Error("Fetching Failed");
  }

  return (await response).data;
};

export default getCoins;
```

```tsx
// implement useQuery inside react function component
const { data, isSuccess, isError, isFetching, isLoading } = useQuery(
  "coins", // query key
  getCoins // pointer to fetcher function
);
```

## useQuery Flow

To see how `useQuery` flow when doing data fetching, or want to see the difference between `isLoading` and `isFetching`, you can see the [diagram here](https://viewer.diagrams.net/?highlight=0000FF&nav=1&title=react-query-usequery-flow.drawio.png#Uhttps://drive.google.com/uc?id=1VenZySvqBF2RIPao5l2-XRHRQ-00N3J7&export=download)

## useQuery options object (third parameter)

The third parameter in the `useQuery` hooks are options object, the list of properties in that object are listed [here](https://react-query.tanstack.com/reference/useQuery)

One of the option are `staleTime`. `staleTime` control how long the query flagged as fresh (in miliseconds), default to 0 (the data will be immediately flagged as stale).

`refetchInterval` control the frequency of refetching data in miliseconds. The default behavior of React Query when do refetching is as follows:

- New instances of the query mount
- The window is refocused
- The network is reconnected.
- The query is optionally configured with a refetch interval.

```tsx
const { data, isSuccess, isError, isFetching, isLoading } = useQuery(
  "coins",
  getCoins,
  {
    // options object
    staleTime: 3000, // ms
    refetchInterval: 5000,
  }
);
```
