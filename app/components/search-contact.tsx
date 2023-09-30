import { FC } from "react";
import { css } from "@emotion/react";

const styleWrapperChildInput = css`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 100%;
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

interface ISearch {
  value: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchContact: FC<ISearch> = ({ value, handleSearch }) => {
  return (
    <form>
      <div css={styleWrapperChildInput}>
        <label htmlFor="search" css={styleLabel}>
          Search Contact Name:
        </label>
        <input
          type="text"
          id="search"
          name="search"
          css={styleInput}
          onChange={handleSearch}
        />
      </div>
    </form>
  );
};

export default SearchContact;
