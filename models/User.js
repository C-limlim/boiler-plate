//모델 - 스키마 감싸줌

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	email : {
		type: String,
		trim: true, // space를 없애주는 역할
		unique: 1
	},
	password: {
		type: String,
		minlength: 5
	},
	lastname: {
		type: String,
		maxlength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: {
		type: String
	},
	tokenExp: {
		type: Number
	}
})

//유저 정보를 저장하기 전에 function 실행
userSchema.pre('save', function ( next ) {
	var user = this;
	
	//user의 password가 수정되었을 떄에만 (not email, name ...)
	if(user.isModified('password')) {
	//비밀번호 암호화
	bcrypt.genSalt(saltRounds, function(err, salt) {
		if(err) return next(err)

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err)
			user.password = hash
			next()
		}) 
	})
	} else {
		next()
	} 
})
userSchema.methods.comparePassword = function(plainPassword, cb) {
	//
	console.log("비교 중")
	//palinPassword 1234567 -> 암호화  ===? 암호화된 비밀번호 ~~~~~~~~
	bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
		if(err) return cb(err)
		else return cb(null, isMatch)
	})
}

userSchema.methods.generateToken = function(cb) {
	//console.log("토큰 생성")
	var user = this;
	var token = jwt.sign(user._id.toHexString(), 'secretToken') // id + secretToken

	user.token = token
	user.save(function(err, user) {
		if(err) return cb(err)
		cb(null, user)
	})

	
}

userSchema.statics.findByToken = function(token, cb) {
	var user = this;
	//복호화
	jwt.verify(token, 'secretToken', function(err, decoded) {
		//유저 아이디를 이용해 유저 찾고
		//클라이언트에서 가져온 토큰과 db에 저장된 토큰이 일치하는지 확인

		user.findOne({"_id": decoded, "token": token}, function(err, user) {
			if(err) return cb(err);
			cb(null, user)
		})
	})
}
const User = mongoose.model('User', userSchema)

module.exports = {User}