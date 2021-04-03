const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const { employeesRepository } = require('./model/employees_repo')

// attach the pug as a template engine
app.set('view engine', 'pug')

// to get body elements from the user's request 
app.use(express.urlencoded({ extended: false}))

// use static format (not dynamic) with public folder
app.use('/static', express.static('./public'))

const employeesRepo = new employeesRepository()

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/add', (req, res) => {
  res.render('add', {success: req.query.success, error: req.query.error})
})

app.post('/add', (req, res) => {
	// get the sent data
	const applicant = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
    email: req.body.email,
    position: req.body.position,
		wage: req.body.wage,
    comment: req.body.comment,
		// I assume newly added employee won't start with vacation
		group: "On Duty"
	} 

	employeesRepo.add(applicant, (err) => {
		if (err || applicant.inValidInput) {
			res.redirect('/add?error=true')
		} else {
			res.redirect('/add?success=true')
		}
	})
})


app.listen(3000, () => console.log("App is running on port 3000"))