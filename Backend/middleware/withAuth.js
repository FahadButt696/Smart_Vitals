export const withAuth = (req, res, next) => {
  const { userId } = req.auth
  // If the user is not authenticated, return an empty object
  req.auth = userId ? auth : {}
  next()
};