// Express 5 catches promise rejections, but this wrapper also works with Express 4.
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve()
    .then(() => handler(req, res, next))
    .catch(next);
