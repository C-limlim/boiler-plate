const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const { User } = require("./models/User");
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

//application/x-ww-form-urlencoded, json 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
	//modgodb ver 6.0 이상 지원 안한다고 하네요
	//useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


app.get('/', (req, res) => res.send('hello world everyone'));

app.post('api/users/register', (req, res) => {
	//get data for clients
	//put data on database
	const user = new User(req.body)

	user.save((err, userInfo) => {
		if (err) return res.json({success: false, err})
		return res.status(200).json({
			success: true
		})
	})
})

app.post('api/users/login', (req, res) => {
	// 요청된 이메일을 데이트베이스에서 찾음
	// 존재한다면 비밀번호 맞는지 확인
	// 비밀번호 맞다면 토큰 생성
	//console.log("성공")
	User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

	//console.log("찾기 성공")
    user.comparePassword(req.body.password, (err, isMatch) => {
		//console.log("매칭 확인")
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

	  //console.log("비번 맞음")
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장 -> 쿠키, 로컬스토리지 ,,,
        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id
        })
      })
    })
  })
})

//auth: middleware
app.get('api/users/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image
	})
});

app.listen(port, () => {
	console.log(`example app listing on port ${port}`);
})