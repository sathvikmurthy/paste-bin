const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const Document = require('./models/Document')
const mongoose = require('mongoose')
mongoose.connect(`${process.env.QOVERY_MONGODB_Z4339CFBC_DATABASE_URL}`, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
})

app.get('/', (req, res) => {
	const code = `Welcome to wastebin!

Use this to write shit and save shit
and to remember shit.`

	res.render("code-display", { code, language: 'plaintext' })
})

app.get('/new', (req, res) => {
	res.render("new")
})

app.post('/save', async (req, res) => {
	const value = req.body.value;
	try {
		const document = await Document.create({ value })
		res.redirect(`${document.id}`)
	} catch (e) {
		res.render("new", { value })
	}
})

app.get('/:id', async (req, res) => {
	const id = req.params.id

	try {
		const document = await Document.findById(id)

		res.render('code-display', { code: document.value, id })
	} catch (e) {
		res.redirect('/')
	}
})

app.get('/:id/duplicate', async (req, res) => {
	const id = req.params.id

	try {
		const document = await Document.findById(id)

		res.render('new', { value: document.value })
	} catch (e) {
		res.redirect(`/${id}`)
	}
})

app.listen(3001, () => console.log("Server Running"))

