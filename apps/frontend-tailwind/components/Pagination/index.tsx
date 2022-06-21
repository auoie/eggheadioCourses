import { usePagination } from '../../hooks/usePagination';
import clsx from 'clsx';
import { Dispatch, FC } from 'react';
import { ChevronRight } from '../../icons/ChevronRight';
import { ChevronLeft } from '../../icons/ChevronLeft';
import { Ellipsis } from '../../icons/Ellipsis';

export interface PageState {
  pageSize: number;
  pageNumber: number;
}
export type PageAction =
  | { type: 'increment'; numPages: number }
  | { type: 'decrement' }
  | { type: 'set page'; pageIndex: number }
  | { type: 'start' }
  | { type: 'set page size'; pageSize: number };
type PaginationProps = {
  page: [PageState, Dispatch<PageAction>];
  numPages: number;
};
const PaginationDiv: FC<
  JSX.IntrinsicElements['td'] & { clickable: boolean }
> = ({ className, children, clickable, ...props }) => {
  return (
    <div
      className={clsx(
        'w-8 h-8 justify-center items-center flex',
        clickable &&
          'hover:bg-zinc-500 hover:bg-opacity-20 transition rounded hover:dark:bg-opacity-20 hover:cursor-pointer hover:dark:bg-zinc-400',
        !clickable && 'text-zinc-400 dark:text-zinc-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Pagination: FC<JSX.IntrinsicElements['div'] & PaginationProps> = ({
  page,
  numPages,
  className,
}) => {
  const [pageState, dispatchPage] = page;
  const paginationArray = usePagination({
    currentPage: pageState.pageNumber,
    numPages,
    siblingCount: 1,
  });
  return (
    <div
      className={clsx(
        'flex items-center justify-center font-semibold select-none',
        className
      )}
    >
      <PaginationDiv
        onClick={() => {
          dispatchPage({ type: 'decrement' });
        }}
        clickable={pageState.pageNumber !== 1}
      >
        <ChevronLeft width={20} height={20} />
      </PaginationDiv>
      {paginationArray.map((pageValue, idx) => {
        if (pageValue === null) {
          return (
            <PaginationDiv
              key={idx}
              className="text-zinc-400"
              clickable={false}
            >
              <Ellipsis width={20} height={20} />
            </PaginationDiv>
          );
        }
        const current = pageState.pageNumber === pageValue;
        return (
          <PaginationDiv
            onClick={() => {
              dispatchPage({ type: 'set page', pageIndex: pageValue });
            }}
            clickable={!current}
            key={idx}
          >
            {pageValue}
          </PaginationDiv>
        );
      })}
      <PaginationDiv
        onClick={() => {
          dispatchPage({ type: 'increment', numPages });
        }}
        clickable={pageState.pageNumber !== numPages}
      >
        <ChevronRight width={20} height={20} />
      </PaginationDiv>
    </div>
  );
};