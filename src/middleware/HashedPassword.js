import bcrypt from "bcryptjs";
const hashedPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (error, salt) => {
      if (error) {
        reject(error);
      }
      bcrypt.hash(password,salt,(error,hash)=>{
        if (error) {
            reject(error);
          }
          resolve(hash)
      })
    });
  });
};
export default hashedPassword