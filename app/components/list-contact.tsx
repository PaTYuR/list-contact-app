import { useState, FC } from "react";
import { css } from "@emotion/react";
import useTable from "../hook/useTable";
import TableFooter from "./table-footer";
import ModalContact from "./modal-contact";
import { gql, useMutation } from "@apollo/client";
import ModalEdit from "./modal-edit";

interface ITable {
  contact: {
    created_at: string;
    first_name: string;
    last_name: string;
    id: number;
    phones: [
      {
        __typename: string;
        number: string;
      }
    ];
    __typename: string;
  }[];
  rowsPerPage: number;
  type: string;
}

const styleWrapperTable = css`
  display: block;
  overflow-x: auto;
  white-space: nowrap;
`;

const styleTable = css`
  white-space: nowrap;
  margin: 0;
  border: none;
  table-layout: fixed;
  width: 640px;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const styleRow = css`
  border: 1px solid #ddd;
`;

const styleFirstRow = css`
  position: absolute;
  width: 10rem;
  top: auto;
  border-top-width: 1px;
  /*compensate for top border*/
  background-color: white;
`;

const styleButtonRow = css`
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

const MY_MUTATION = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

const ADD_FAVORITE = gql`
  mutation AddNumberToContact($contact_id: Int!, $phone_number: String!) {
    insert_phone(objects: { contact_id: $contact_id, number: $phone_number }) {
      returning {
        contact {
          id
          last_name
          first_name
          phones {
            number
          }
        }
      }
    }
  }
`;

const ListContact: FC<ITable> = ({ contact, rowsPerPage, type }) => {
  const [page, setPage] = useState<number>(1);
  const [contactdetail, setContactDetail] = useState<any[]>([]);
  const [modaldetailisopen, setModalDetailIsOpen] = useState<boolean>(false);
  const [modaleditisopen, setModalEditIsOpen] = useState<boolean>(false);

  const { slice, range } = useTable(contact, page, rowsPerPage);
  const [mutate, { data, loading, error }] = useMutation(MY_MUTATION);
  const [AddNumberToContact] = useMutation(ADD_FAVORITE);

  const openModalDetail = (
    id: number,
    modadetaillisopen: boolean,
    modaleditisopen: boolean
  ) => {
    setModalDetailIsOpen(modadetaillisopen);
    const obj = contact.find((item: { id: number }) => item.id === id);
    setContactDetail([obj]);
    setModalEditIsOpen(modaleditisopen);
  };
  const openModalEdit = (modaleditisopen: boolean) => {
    setModalEditIsOpen(modaleditisopen);
  };
  const deleteContact = (id: number) => {
    mutate({ variables: { id: id } }).then(() => {
      alert("Contact successfully deleted");
      location.reload();
    });
  };
  const addFavorite = (id: string) => {
    AddNumberToContact({
      variables: { contact_id: id, phone_number: "+LOVE+" },
    }).then(() => {
      alert("Contact successfully added to favorites");
      location.reload();
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  return (
    <>
      <div css={styleWrapperTable}>
        <table css={styleTable}>
          <thead css={styleRow}>
            <tr>
              <th
                css={[
                  styleFirstRow,
                  { borderBottom: "1px solid #ddd", padding: "0.5rem 1rem" },
                ]}
              >
                Full Name
              </th>
              <th css={{ padding: "0.5rem 1rem" }}>Phone Number</th>
              <th css={{ padding: "0.5rem 1rem", width: "14rem" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {slice.length == 0 ? (
              <tr css={[styleRow, { padding: "0.5rem 1rem" }]}>
                <td css={[styleFirstRow, { padding: "0.5rem 1rem" }]}>
                  Search results not found.
                </td>
              </tr>
            ) : (
              slice.map((item: any) => (
                <tr key={item.id} css={styleRow}>
                  <td
                    css={[
                      styleFirstRow,
                      {
                        padding: "0.5rem 1rem",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      },
                    ]}
                  >
                    {item.first_name} {item.last_name}
                  </td>
                  <td
                    css={{
                      padding: "0.5rem 1rem",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.phones[0].number}
                  </td>
                  <td css={[styleButtonRow, { padding: "0.5rem 1rem" }]}>
                    {type == "favorite" ? (
                      <></>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addFavorite(item.id)}
                      >
                        Add Favorite
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openModalDetail(item.id, true, false)}
                    >
                      Detail
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteContact(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <span css={{fontSize:'12px', background:'yellow'}}>* table can scroll x</span>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
      <ModalContact
        state={modaldetailisopen}
        stateedit={modaleditisopen}
        openModal={openModalDetail}
        contactdetail={contactdetail}
      ></ModalContact>
      <ModalEdit
        state={modaleditisopen}
        openModal={openModalEdit}
        contactdetail={contactdetail}
      ></ModalEdit>
    </>
  );
};

export default ListContact;
