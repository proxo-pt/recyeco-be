import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(404).json({ message: "incorrect credential" });
  }

  try {
    const jwtToken = token.split(" ").pop();
    const data = jwt.verify(jwtToken, "qwertyuiop");
    if (data === null) {
      return res.status(404).json({ message: "incorrect credential" });
    }

    req.akun = data;
    next();
  } catch (error) {
    return res.status(403).json({ message: "incorrect credential" });
  }
};

export default verifyToken;
