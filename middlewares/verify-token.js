const jwt = require("jsonwebtoken");
const user = require("../models/user");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log("test", token);
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({ message: "incorrect credential" });
  }
  try {
    const jwtToken = token.split(" ").pop();
    const data = jwt.verify(jwtToken, "qwertyuiop");

    // const akuns = await user.findByPk(data.id);
    // if (!akuns) {
    //   return res.status(404).json({ message: "user no found" });
    // }
    // if (akuns.id !== datas.id) {
    //   return res.status(403).json({ message: "Harus Login Terlbih Dahulu!" });
    // }
    console.log("huhuhuyy", data);

    req.akun = data;
    next();
  } catch (error) {
    return res.status(403).json({ message: "incorrect credential" });
  }
};
