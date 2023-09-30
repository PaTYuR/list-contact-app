"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const inter = Inter({ subsets: ["latin"] });

const client = new ApolloClient({
  uri: "https://wpe-hiring.tokopedia.net/graphql",
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} id="root-body">
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
