const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysqlPool = require("../config/db");
const randomString = require("randomstring");
const sendMail = require("../helper/sendMail");

const router = express.Router();
router.use(express.json());

router.post("/signIn", async (req, res) => {
  try {
    const username = req.body.username;
    const fullName = req.body.fullName;
    const emailId = req.body.email;
    const password = req.body.password;
    const dob = req.body.dob;
    const profilePhoto = req.body.imageUrl;
    const isVerified=req.body.isVerified;

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserQuery = `SELECT * FROM credentials WHERE username = '${username}'`;
    const [existingUser] = await mysqlPool.query(checkUserQuery);

    if (existingUser.length > 0) {
      return res.json({ message: "user already exists" });
    }

    const query = `INSERT INTO credentials (fullName, emailId, username, password, dob, profilePhoto,isVerified) 
      VALUES ('${fullName}', '${emailId}', '${username}', '${hashedPassword}', '${dob}', '${profilePhoto}','${isVerified}') `;

    await mysqlPool.query(query).then(() => {
      console.log("data inserted");
    });
    let mailSubject = "Mail verification";
    const token = randomString.generate();

    let content = `
    <p>Hello ${fullName},</p>
    <p>Please <a href="${process.env.BASE_URL}/main/mailVerification?token=${token}">Verify</a> your Mail.</p>`;

    sendMail(emailId, mailSubject, content);

    mysqlPool.query(
      `update credentials set token= '${token}' where emailId='${emailId}'`
    );

    return res.status(200).send({
      message: "The user has been signed in. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting data");
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT * FROM credentials WHERE username = '${username}'`;
    const [results] = await mysqlPool.query(query);

    if (results.length == 0) {
      return res.json({
        message: "User doesn't exist",
      });
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        message: "Username or password is incorrect",
      });
    }

    if (user.isVerified != 1) {
      return res.json({
        message: "User is not verified",
      });
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during login");
  }
});

const userRouter = router;
module.exports = userRouter;
