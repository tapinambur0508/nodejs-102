import { SORT_ORDER } from '../constants/index.js';

function parseSortBy(maybeSortBy) {
  if (typeof maybeSortBy !== 'string') {
    return '_id';
  }

  const keys = ['_id', 'name', 'year', 'gender', 'onDuty', 'createdAt'];

  if (keys.includes(maybeSortBy)) {
    return maybeSortBy;
  }

  return '_id';
}

function parseSortOrder(maybeSortOrder) {
  if (typeof maybeSortOrder !== 'string') {
    return SORT_ORDER.ASC;
  }

  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(maybeSortOrder)) {
    return maybeSortOrder;
  }

  return SORT_ORDER.ASC;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
