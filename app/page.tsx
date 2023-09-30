"use client";

import { css } from "@emotion/react";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ListContact from "./components/list-contact";
import "react-tabs/style/react-tabs.css";
import SearchContact from "./components/search-contact";
import AddContact from "./components/add-contact";

const style = css`
  color: hotpink;
`;
const styleContainer = css`
  max-width: 640px;
  padding: 0rem 1rem;
`;

const styleWrapperTabPanel = css`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  padding: 1rem 0rem;
`;

const GET_CONTACT_LIST = gql`
  query GetContactList {
    contact {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

export default function Home() {
  const [search, setSearch] = useState("");
  const [searchdata, setSearchData] = useState<any[]>([]);
  const [datafavorite, setDataFavorite] = useState<any[]>([]);

  const { loading, error, data } = useQuery(GET_CONTACT_LIST);

  useEffect(() => {
    if (data) {
      const data_favorite = data.contact.filter((object: any) =>
        object.phones.some((item: any) => item.number == "+LOVE+")
      );
      const data_not_favorite = data.contact.filter(
        (item: any) => !data_favorite.includes(item)
      );
      setDataFavorite(data_favorite);
      const data_search = data_not_favorite.filter((item: any) =>
        (item.first_name + " " + item.last_name)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setSearchData(
        data_search.sort(function (a: any, b: any) {
          return a.id - b.id;
        })
      );
    }
  }, [data, search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <main css={styleContainer}>
      <h2 css={style}>List Contact</h2>
      <AddContact contact={searchdata}></AddContact>

      <Tabs>
        <TabList>
          <Tab>Reguler</Tab>
          <Tab>Favorite</Tab>
        </TabList>

        <TabPanel>
          <div css={styleWrapperTabPanel}>
            <SearchContact
              value={search}
              handleSearch={handleSearch}
            ></SearchContact>
            <ListContact contact={searchdata} rowsPerPage={10} type={'no-favorite'}></ListContact>
          </div>
        </TabPanel>
        <TabPanel>
          <ListContact contact={datafavorite} rowsPerPage={10} type={'favorite'}></ListContact>
        </TabPanel>
      </Tabs>
    </main>
  );
}
