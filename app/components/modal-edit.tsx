import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import { gql, useMutation } from "@apollo/client";
import { css } from "@emotion/react";

interface IModal {
  state: boolean;
  openModal: (modalisopen: boolean) => void;
  contactdetail: any[];
}

const styleWrapperForm = css`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`;

const styleWrapperParentInput = css`
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  align-items: center;
`;

const styleWrapperChildInput = css`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;
`;

const styleWrapperInputDelete = css`
  position: relative;
`;

const styleLabel = css`
  font-size: 0.875rem;
`;

const styleInput = css`
  padding: 0.25rem;
  border-width: 1px;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  width: -webkit-fill-available;
`;

const styleButton = css`
  padding: 0.5rem;
  height: fit-content;
`;

const styleErrorMessages = css`
  font-size: 0.75rem;
  color: red;
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

const styleWrapperModalFooter = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

interface ErrorMessage {
  messages: string;
}

const EDIT_CONTACT_BY_ID = gql`
  mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`;

const EDIT_PHONE_NUMBER = gql`
  mutation EditPhoneNumber(
    $pk_columns: phone_pk_columns_input!
    $new_phone_number: String!
  ) {
    update_phone_by_pk(
      pk_columns: $pk_columns
      _set: { number: $new_phone_number }
    ) {
      contact {
        id
        last_name
        first_name
        created_at
        phones {
          number
        }
      }
    }
  }
`;

const ModalEdit: FC<IModal> = ({ state, openModal, contactdetail }) => {
  const [stateedit, setStateEdit] = useState("name");
  const [disabledinput, setDisabledInput] = useState("");
  const [idcontact, setIdContact] = useState();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [defaultnumber, setDefaultNumber] = useState("");
  const [dataphonenumber, setDataPhoneNumber] = useState([{ number: "" }]);
  const [errorfname, setErrorFname] = useState<ErrorMessage>({
    messages: "",
  });
  const [errorlname, setErrorLname] = useState<ErrorMessage>({
    messages: "",
  });
  const [errorfullname, setErrorFullName] = useState<ErrorMessage>({
    messages: "",
  });
  const [errorphone, setErrorPhone] = useState<ErrorMessage>({
    messages: "",
  });

  useEffect(() => {
    contactdetail.map((item) => {
      setFirstName(item.first_name);
      setLastName(item.last_name);
      setDataPhoneNumber(item.phones);
      setIdContact(item.id);
    });
  }, [contactdetail, state]);

  const changeState = () => {
    if (stateedit == "name") {
      setStateEdit("number");
    } else if (stateedit == "number") {
      setStateEdit("name");
    }
  };
  const changePhone = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const onchangeVal = [...dataphonenumber];
    onchangeVal[i] = { number: e.target.value };
    setDataPhoneNumber(onchangeVal);
  };
  const handleEditInputPhone = (
    e: React.MouseEvent<HTMLButtonElement>,
    i: number,
    number: string
  ) => {
    e.preventDefault();
    setDisabledInput(`pnumber-${i}`);
    setDefaultNumber(number);
  };
  const [EditContactById, { data, loading, error, reset }] =
    useMutation(EDIT_CONTACT_BY_ID);

  const [EditPhoneNumber] = useMutation(EDIT_PHONE_NUMBER);

  const submitEditedName = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fname_match = /^[a-zA-Z0-9 ]*$/.test(firstname);
    const lname_match = /^[a-zA-Z0-9 ]*$/.test(lastname);
    const check_fullname = contactdetail.find(
      (item) =>
        item.first_name + " " + item.last_name == firstname + " " + lastname
    );

    if (!fname_match) {
      setErrorFname({ messages: "Invalid" });
    } else if (firstname == "") {
      setErrorFname({ messages: "Invalid" });
    } else {
      setErrorFname({ messages: "" });
    }

    if (!lname_match) {
      setErrorLname({ messages: "Invalid" });
    } else if (lastname == "") {
      setErrorLname({ messages: "Invalid" });
    } else {
      setErrorLname({ messages: "" });
    }

    if ([check_fullname].length <= 1) {
      setErrorFullName({ messages: "" });
    } else {
      setErrorFullName({ messages: "Name has been used" });
    }

    if (fname_match && lname_match && [check_fullname].length <= 1) {
      EditContactById({
        variables: {
          id: idcontact,
          _set: {
            first_name: firstname,
            last_name: lastname,
          },
        },
      }).then(() => {
        alert("Contact successfully updated");
        location.reload();
      });
    }
  };
  const submitEditedPhone = (
    e: React.MouseEvent<HTMLButtonElement>,
    i: number,
    number: string
  ) => {
    e.preventDefault();
    const true_phone = /^(\+62)[1-9][0-9]{7,12}$/.test(
      dataphonenumber[i].number
    );

    if (!true_phone) {
      setErrorPhone({
        messages: "Starting with +62, min 10, max 15 and only numeric",
      });
    } else {
      setErrorPhone({ messages: "" });
      EditPhoneNumber({
        variables: {
          pk_columns: {
            number: defaultnumber,
            contact_id: idcontact,
          },
          new_phone_number: dataphonenumber[i].number,
        },
      }).then(() => {
        alert("Contact successfully updated");
        location.reload();
      });
    }
  };
  return (
    <Modal
      isOpen={state}
      style={customStyles}
      contentLabel="Edit Contact Modal"
    >
      <h3
        css={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        Edit Contact{" "}
        <button type="button" onClick={changeState}>
          Edit {stateedit == "name" ? "Number" : "Name"}
        </button>
      </h3>
      <div>
        <form css={[styleWrapperForm, { marginBottom: "2rem" }]}>
          {stateedit == "name" ? (
            <div
              css={[
                styleWrapperParentInput,
                css`
                  @media (max-width: 375px) {
                    flex-direction: column;
                    row-gap: 1rem;
                  }
                `,
              ]}
            >
              <div css={styleWrapperChildInput}>
                <label htmlFor="fname" css={styleLabel}>
                  First name:
                </label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={firstname}
                  css={styleInput}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFirstName(event.target.value)
                  }
                />
                {errorfname.messages && (
                  <span css={styleErrorMessages}>{errorfname.messages}</span>
                )}
              </div>
              <div css={styleWrapperChildInput}>
                <label htmlFor="lname" css={styleLabel}>
                  Last name:
                </label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  value={lastname}
                  css={styleInput}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setLastName(event.target.value)
                  }
                />
                {errorlname.messages && (
                  <span css={styleErrorMessages}>{errorlname.messages}</span>
                )}
              </div>
              {errorfullname.messages && (
                <span css={styleErrorMessages}>{errorfullname.messages}</span>
              )}
            </div>
          ) : (
            <div
              css={[
                styleWrapperParentInput,
                { flexWrap: "wrap", rowGap: "0.5rem" },
              ]}
            >
              {dataphonenumber.map((val, i) => (
                <div css={styleWrapperChildInput} key={i}>
                  <label htmlFor={`pnumber-${i}`} css={styleLabel}>
                    Phone number:
                  </label>
                  <div css={styleWrapperInputDelete}>
                    <input
                      type="tel"
                      id={`pnumber-${i}`}
                      name={`pnumber-${i}`}
                      css={[styleInput, { paddingRight: "3.75rem" }]}
                      defaultValue={val.number}
                      disabled={disabledinput == `pnumber-${i}` ? false : true}
                      onChange={(e) => changePhone(e, i)}
                    />
                    {disabledinput == `pnumber-${i}` ? (
                      <button
                        type="submit"
                        onClick={(e) => submitEditedPhone(e, i, val.number)}
                        css={{
                          position: "absolute",
                          right: "0.25rem",
                          top: "0.25rem",
                        }}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleEditInputPhone(e, i, val.number)}
                        css={{
                          position: "absolute",
                          right: "0.25rem",
                          top: "0.25rem",
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {errorphone.messages && (
                <span css={styleErrorMessages}>{errorphone.messages}</span>
              )}
            </div>
          )}
          <div css={styleWrapperModalFooter}>
            <button
              type="button"
              css={styleButton}
              onClick={() => openModal(false)}
            >
              Close
            </button>
            {stateedit == "name" ? (
              <button
                type="submit"
                css={styleButton}
                onClick={(e) => submitEditedName(e)}
              >
                Submit Edited Name
              </button>
            ) : (
              <></>
            )}
          </div>
          {loading ? "Submitting" : <></>}
          {error ? (
            <span css={styleErrorMessages}>
              Submission error! {error.message}
              <button onClick={() => reset()}>Retry</button>
            </span>
          ) : (
            <></>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default ModalEdit;
