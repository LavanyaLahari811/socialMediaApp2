const mysqlPool = require("../config/db");

const verifyMail = async (req, res) => {
  try {
    let token = req.query.token;

    const [result] = await mysqlPool.query(
      `SELECT * FROM credentials WHERE token = ?`,
      [token]
    );

    if (result.length > 0) {
      await mysqlPool.query(
        `UPDATE credentials SET token = NULL, isVerified = 1 WHERE id = ?`,
        [result[0].id]
      );

      return res.render("mailVerified", {
        message: "Mail Verified Successfully!",
      });
    } else {
      return res.render("404");
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("error", { message: "Internal Server Error" });
  }
};

module.exports = verifyMail;
