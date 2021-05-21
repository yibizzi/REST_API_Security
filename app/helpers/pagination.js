//Setting offset and limit ;
exports.setOffset = (defaultOffset = 0, bodyOffset) => {
  if (bodyOffset) {
    return bodyOffset;
  }
  return defaultOffset;
};


exports.setLimit = (defaultLimit = 10, limitMax = 30, bodyLimit) => {
  if (bodyLimit && bodyLimit < limitMax) {
    return bodyLimit;
  } else if (bodyLimit && bodyLimit >= limitMax) {
    return limitMax;
  } else {
    return defaultLimit;
  }
};
