import { useMemo } from 'react';

// There will not be dots on the left iff currentPage - 1 <=  siblingCount + 2
// There will not be dots on the right iff numPages - currentPage <= siblingCount + 2
export const usePagination = ({
  numPages,
  currentPage,
  siblingCount,
}: {
  numPages: number;
  currentPage: number;
  siblingCount: number;
}) => {
  const pages = useMemo(() => {
    const outputLength = 2 * siblingCount + 5;
    // Case 1: numPages <= 2 * siblingCount + 5
    if (numPages <= outputLength) {
      const result = [];
      for (let i = 1; i <= numPages; i++) {
        result.push(i);
      }
      return result;
    }
    // Now numPages > 2 * siblingCount + 5
    // Case 2: currentPage - 1 <= siblingCount + 2
    if (currentPage - 1 <= siblingCount + 2) {
      const result: (null | number)[] = [];
      for (let i = 1; i <= 2 * siblingCount + 3; i++) {
        result.push(i);
      }
      result.push(null);
      result.push(numPages);
      return result;
    }
    // Case 3: numPages - currentPage <= siblingCount + 2
    if (numPages - currentPage <= siblingCount + 2) {
      const result: (null | number)[] = [];
      result.push(1);
      result.push(null);
      for (let i = numPages - (2 * siblingCount + 3) + 1; i <= numPages; i++) {
        result.push(i);
      }
      return result;
    }
    // Case 4: currentPage - 1 > siblingCount + 2 && numPages - currentPage > siblingCount + 2
    // Note that it is impossible for currentPage - 1 <= siblingCount + 2 && numPages - currentPage <= siblingCount + 2
    // because this would imply numPages - 1 <= 2 * siblingCount + 4 which was already handled by case 1
    const result: (null | number)[] = [];
    result.push(1);
    result.push(null);
    for (
      let i = currentPage - siblingCount;
      i <= currentPage + siblingCount;
      i++
    ) {
      result.push(i);
    }
    result.push(null);
    result.push(numPages);
    return result;
  }, [currentPage, numPages, siblingCount]);
  return pages;
};
