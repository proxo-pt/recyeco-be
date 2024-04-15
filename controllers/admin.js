import user from "../models/user.js";
import { Op } from "sequelize";

export default {
  async status(res) {
    try {
      const produk = await user.findAll({
        where: {
          token: {
            [Op.not]: null,
          },
        },
        attributes: ["id", "email", "username", "foto", "point", "ttl", "jk"],
      });

      return res.json({ online: produk });
    } catch (error) {
      return res.json({ message: error });
    }
  },
};
