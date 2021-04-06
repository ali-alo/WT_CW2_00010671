const express = require('express')
const app = express()
const employees = require('./routes/employees')

const { employeesRepository } = require('./public/js/employees_repo')

// attach the pug as a template engine
app.set('view engine', 'pug')

// for all urls starting with /employees, use employees.js file to handel requests
app.use('/employees', employees)

// to get body elements from the user's request 
app.use(express.urlencoded({ extended: false}))

// use static format (not dynamic) with public folder
app.use('/static', express.static('./public'))

const employeesRepo = new employeesRepository()

app.get('/', (req, res) => {
  res.render('index');
});

// becayse the server has the same HTTP request with different request methods .route() is used
app.route('/add')
	.get((req, res) => {
		res.render('add', {success: req.query.success, error: req.query.error})
	})
	.post((req, res) => {
		// get the sent data
		const employee = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			position: req.body.position,
			wage: req.body.wage,
			comment: req.body.comment,
			// I assume newly added employee won't start with vacation
			status: "On Duty",
			terminated: false
	} 

	employeesRepo.add(employee, (err) => {
		// employee.invalidInput will be true only if employee's input is invalid. If it is valid invalidInput won't be created, hence won't be sent to the employees.json
		if (err || employee.invalidInput) {
			res.redirect('/add?error=true')
		} else {
			res.redirect('/add?success=true')
		}
	})
})

app.get('/onDutyEmployees', (req, res) => {
	const onDutyEmployees = employeesRepo.getAllOnDuty()
	res.render('on_duty_employees', {onDutyEmployees})
})

app.get('/vacationEmployees', (req, res) => {
	const vacationEmployees = employeesRepo.getAllVacation()
	res.render('vacation_employees', {vacationEmployees})
})

app.get('/medicationEmployees', (req, res) => {
	const medicationEmployees = employeesRepo.getAllMedication()
	res.render('medication_employees', {medicationEmployees})
})

app.get('/terminated', (req, res) => {
	const terminatedEmployees = employeesRepo.getAllTerminated()
	res.render('terminated', { terminatedEmployees })
})

// Basic  API
app.get('/api/v1/employees', (req, res) => {
	res.json(employeesRepo.employeesDb)
})

app.listen(3000, () => console.log("App is running on port 3000"))