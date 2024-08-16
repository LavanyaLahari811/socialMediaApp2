const express=require("express");

const router = express();

router.set('view engine','ejs');
router.set('views','./views');

const userHelper=require('../helper/verifyMail');

router.get('/mailVerification',userHelper);


const verificationRouter=router;
module.exports=verificationRouter;