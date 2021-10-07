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

## Simple Pagination

To make a good performing pagination, we need to make **query** based on the current page. The query in `useQuery` accept an array. In this example, we make query from `"coins"` to `["coins", page]`. This separate query for each page, whenever page are not rendered in the browser, they will enter `inactive` state and the data for inactive query stored in cache will persist for some time.

```tsx
// state
const [page, setPage] = useState(1);

// useQuery react query
const { data, isSuccess, isError, isFetching, isLoading } = useQuery(
  ["coins", page],
  () => getCoins(page),
  {
    staleTime: 3000, // ms
    refetchInterval: 5000,
  }
);
```

## React Query SSR

There's two approach when you want to fetch data with `useQuery` in SSR, with `initialData` and `Hydration`

### SSR Using initialData

First, export an asynchronous `getStaticProps` function. Inside that function we can return an object with `props` properties, `props` value is an object and we can add our data from our fetcher function.

```ts
export async function getStaticProps() {
  const initialData = await getCoins();

  return { props: { initialData } };
}
```

After that, we can accept the props in the **page component**. In the `useQuery` hooks options, we can add another property which is `initialData`, pass the props from `getStaticProps` to the `initialData`.

```tsx
const { data, isSuccess, isError, isFetching, isLoading } = useQuery(
  ["coins", page],
  () => getCoins(page),
  {
    staleTime: 3000, // ms
    refetchInterval: 5000,
    initialData: initialData, // this is from props
  }
);
```

**Note:** The drawback using initialData approach is, we you want to use `useQuery` hooks in deeply nested component inside, you need to pass initial data down, [More detail check this docs from react query](https://react-query.tanstack.com/guides/ssr)

### SSR using Hydration

To use **Hydration** approach instead of initialData, we need to setup our Hydration in the `_app.tsx`. Import `Hydrate` from React Query, then place `<Hydrate>` inside `QueryClientProvider`. Pass `pageProps.dehydratedState` to the `state` props in `Hydrate`.

```tsx
function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
        <ReactQueryDevtools />
      </Hydrate>
    </QueryClientProvider>
  );
}
```

After that, we can export `getStaticProps` in our page component, in that function, create a `queryClient` instance. Then we await our data by using `prefetchQuery`. `prefetcQuery` method take parameter `(queryKey, fetcherFunction)`
