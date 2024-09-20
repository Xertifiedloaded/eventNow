import bcrypt from "bcryptjs"
const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed)
}

export default comparePassword
