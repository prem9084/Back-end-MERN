import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const decode = await jwt.verify(req.headers.authorization, process.env.JWT);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};
