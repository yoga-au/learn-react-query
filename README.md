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
