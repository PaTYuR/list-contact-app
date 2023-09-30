import { FC } from "react";
import Modal from "react-modal";
import { useQuery, gql } from "@apollo/client";
import { css } from "@emotion/react";

interface IModal {
  state: boolean;
  stateedit: boolean;
  openModal: (
    id: number,
    modaldetailisopen: boolean,
    modaleditisopen: boolean
  ) => void;
  contactdetail: any[];
}

const styleWrapperModalContent = css`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`;

const styleWrapperModalFooter = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const styleTable = css`
  font-size: 0.875rem;
`;

const styleButton = css`
  padding: 0.5rem;
  height: fit-content;
`;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root-body");
const GET_CONTACT_DETAIL = gql`
  query GetContactDetail($id: Int!) {
    contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`;

const ModalContact: FC<IModal> = ({
  state,
  openModal,
  contactdetail,
  stateedit,
}) => {
  const { loading, error, data } = useQuery(GET_CONTACT_DETAIL, {
    variables: { id: contactdetail.map((item: any) => item.id).toString() },
  });
  return data != undefined ? (
    [data.contact_by_pk].map((item: any) => (
      <Modal
        isOpen={state}
        onRequestClose={() => openModal(item.id, !state, false)}
        style={customStyles}
        contentLabel="Detail Modal"
        key={item.id}
      >
        <h3>Contact Detail</h3>
        <div css={styleWrapperModalContent}>
          <table css={styleTable}>
            <thead></thead>
            <tbody>
              <tr>
                <td>ID</td>
                <td>:&nbsp;{item.id}</td>
              </tr>
              <tr>
                <td>First Name</td>
                <td>:&nbsp;{item.first_name}</td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>:&nbsp;{item.last_name}</td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>
                  {item.phones.map((item: any, i: number) => (
                    <div key={i}>
                      {i >= 1 ? "," : ":"}&nbsp;{item.number}
                    </div>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Create At</td>
                <td>
                  :&nbsp;
                  {new Date(Date.parse(item.created_at)).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div css={styleWrapperModalFooter}>
            <button
              type="button"
              css={styleButton}
              onClick={() => openModal(item.id, false, false)}
            >
              Close
            </button>
            <button
              type="button"
              css={styleButton}
              onClick={() => openModal(item.id, false, !stateedit)}
            >
              Edit
            </button>
          </div>
        </div>
      </Modal>
    ))
  ) : (
    <></>
  );
};

export default ModalContact;
