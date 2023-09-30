import { useEffect, FC } from "react";
import { css } from "@emotion/react";

interface ITableFooter {
  range: number[];
  setPage: (page: number) => void;
  page: number;
  slice: any[];
}

const styleWrapperPagination = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  column-gap: 0.5rem;
  margin-top: 0.75rem;
`;

const styleButton = css`
  padding: 0.25rem;
  height: fit-content;
`;

const styleButtonActive = css`
  padding: 0.25rem;
  color: blue;
  height: fit-content;
`;

const TableFooter: FC<ITableFooter> = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div css={styleWrapperPagination}>
      {range.map((el, index) => (
        <button
          key={index}
          css={page == el ? styleButtonActive : styleButton}
          onClick={() => setPage(el)}
        >
          {el}
        </button>
      ))}
    </div>
  );
};

export default TableFooter;
