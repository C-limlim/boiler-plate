const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cofla0317:12341234@boilerplate.zsx1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
	//modgodb ver 6.0 이상 지원 안한다고 하네요
	//useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


app.get('/', (req, res) => res.send('hello world'));

app.listen(port, () => {
	console.log(`example app listing on port ${port}`);
})