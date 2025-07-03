import bcrypt from "bcryptjs";

const password = "ardhangaming";

bcrypt.hash(password, 10).then((hashed) => {
  console.log("Hash:", hashed);
});

