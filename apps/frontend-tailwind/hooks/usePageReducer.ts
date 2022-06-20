import { useReducer } from 'react';
import { PageAction, PageState } from '../components/Pagination';

export const usePageReducer = (pageSize: number) => {
  const [pageState, dispatchPage] = useReducer(
    (state: PageState, action: PageAction): PageState => {
      switch (action.type) {
        case 'decrement':
          return {
            pageSize: state.pageSize,
            pageNumber: Math.max(state.pageNumber - 1, 1),
          };
        case 'increment':
          return {
            pageSize: state.pageSize,
            pageNumber: Math.min(state.pageNumber + 1, action.numPages),
          };
        case 'set page':
          return {
            pageSize: state.pageSize,
            pageNumber: action.pageIndex,
          };
        case 'start':
          return {
            pageSize: state.pageSize,
            pageNumber: 1,
          };
        case 'set page size':
          return {
            pageSize: action.pageSize,
            pageNumber: 1,
          };
      }
    },
    {
      pageSize,
      pageNumber: 1,
    }
  );
  return { pageState, dispatchPage };
};
