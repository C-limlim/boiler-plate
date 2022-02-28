const { request } = require("express")
const {User } = require("../models/User");

let auth = (req, res, next) => {
  //인증 처리

  //클라이언트 쿠키에서 토큰 가져옴
  //토큰 복호화 -> 유저 찾음
  //유저가 있으면 인증 / 없으면 노인증
  
  let token = req.cookies.x_auth;
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    //미들웨어가 끝났으면 next를 넣어줘야 다음으로 넘어감
    next();
  });
}

module.exports = {auth}