import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  res.status(200).json({
    success: true,
    token,
  })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.organizerId = decoded.id
    req.organizerEmail = decoded.email
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" })
  }
}
