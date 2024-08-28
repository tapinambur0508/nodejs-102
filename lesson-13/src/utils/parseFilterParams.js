function parseNumber(maybeNumber) {
  if (typeof maybeNumber !== 'string') {
    return undefined;
  }

  const parseNumber = parseInt(maybeNumber);

  if (Number.isNaN(parseNumber)) {
    return undefined;
  }

  return parseNumber;
}

export function parseFilterParams(query) {
  const { minYear, maxYear } = query;

  const parsedMinYear = parseNumber(minYear);
  const parsedMaxYear = parseNumber(maxYear);

  return {
    minYear: parsedMinYear,
    maxYear: parsedMaxYear,
  };
}
