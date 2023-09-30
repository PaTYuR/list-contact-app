import { useEffect, useState, FC } from "react";
import { css } from "@emotion/react";
import { gql, useMutation } from "@apollo/client";

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

const ADD_CONTACT_WITH_PHONES = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

interface IContact {
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
}

interface ErrorMessage {
  messages: string;
}

const AddContact: FC<IContact> = ({ contact }) => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
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

  const addNewPhone = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDataPhoneNumber([...dataphonenumber, { number: "" }]);
  };
  const changePhone = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const onchangeVal = [...dataphonenumber];
    onchangeVal[i]["number"] = e.target.value;
    setDataPhoneNumber(onchangeVal);
  };
  const handleDeleteInputPhone = (
    e: React.MouseEvent<HTMLButtonElement>,
    i: number
  ) => {
    e.preventDefault();
    const deleteVal = [...dataphonenumber];
    deleteVal.splice(i, 1);
    setDataPhoneNumber(deleteVal);
  };
  const [AddContactWithPhones, { data, loading, error }] = useMutation(
    ADD_CONTACT_WITH_PHONES
  );
  const submitNewContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fname_match = /^[a-zA-Z0-9 ]*$/.test(firstname);
    const lname_match = /^[a-zA-Z0-9 ]*$/.test(lastname);
    const list_phone_number = dataphonenumber.map(function (item) {
      return item["number"];
    });
    const true_phone = list_phone_number.filter((value) =>
      /^(\+62)[1-9][0-9]{7,12}$/.test(value)
    );
    const check_fullname = contact.find(
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

    if (check_fullname == undefined) {
      setErrorFullName({ messages: "" });
    } else {
      setErrorFullName({ messages: "Name has been used" });
    }

    if (true_phone.length != dataphonenumber.length) {
      setErrorPhone({ messages: "Starting with +62, min 10, max 15" });
    } else {
      setErrorPhone({ messages: "" });
    }

    if (
      fname_match &&
      lname_match &&
      check_fullname == undefined &&
      true_phone.length == dataphonenumber.length
    ) {
      AddContactWithPhones({
        variables: {
          first_name: firstname,
          last_name: lastname,
          phones: dataphonenumber,
        },
      }).then(() => {
        alert("New contact successfully added");
        location.reload();
      });
    }
  };

  return (
    <form css={[styleWrapperForm, { marginBottom: "2rem" }]}>
      <div
        css={[
          styleWrapperParentInput,
          css`
            @media (max-width: 425px) {
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
      <div
        css={[styleWrapperParentInput, { flexWrap: "wrap", rowGap: "0.5rem" }]}
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
                onChange={(e) => changePhone(e, i)}
              />
              {dataphonenumber.length == 1 ? (
                <></>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleDeleteInputPhone(e, i)}
                  css={{
                    position: "absolute",
                    right: "0.25rem",
                    top: "0.25rem",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        <button css={styleButton} onClick={(e) => addNewPhone(e)}>
          Add
        </button>
        {errorphone.messages && (
          <span css={styleErrorMessages}>{errorphone.messages}</span>
        )}
      </div>
      <div css={styleWrapperParentInput}>
        <button
          type="submit"
          css={styleButton}
          onClick={(e) => submitNewContact(e)}
        >
          Submit New Contact
        </button>
      </div>
      {loading ? "Submitting" : <></>}
      {error ? (
        <span css={styleErrorMessages}>
          Submission error! {error.message}
          <button onClick={() => location.reload()}>Retry</button>
        </span>
      ) : (
        <></>
      )}
    </form>
  );
};

export default AddContact;
