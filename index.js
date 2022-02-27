const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const { User } = require("./models/User");
const config = require('./config/key')

//application/x-ww-form-urlencoded, json 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
	//modgodb ver 6.0 이상 지원 안한다고 하네요
	//useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


app.get('/', (req, res) => res.send('hello world everyone'));

app.post('/register', (req, res) => {
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

app.listen(port, () => {
	console.log(`example app listing on port ${port}`);
})