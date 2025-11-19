export const populateUserReview = async (req, res, next) => {
  const userId = req.user?._id;
  res.locals.userId = userId;
  next();
};