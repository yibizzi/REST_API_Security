//Setting offset and limit ;
exports.setOffset = (defaultOffset = 0, queryOffset) => {
  if (queryOffset) {
    return queryOffset;
  }
  return defaultOffset;
};


exports.setLimit = (defaultLimit = 10, limitMax = 30, queryLimit) => {
  if (queryLimit && queryLimit < limitMax) {
    return queryLimit;
  } else if (queryLimit && queryLimit >= limitMax) {
    return limitMax;
  } else {
    return defaultLimit;
  }
};
