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
	const employee = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
    email: req.body.email,
    position: req.body.position,
		wage: req.body.wage,
    comment: req.body.comment,
		// I assume newly added employee won't start with vacation
		status: "On Duty"
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

app.get('/employees', (req, res) => {
	const onDutyEmployees = employeesRepo.getAllOnDuty()
	res.render('employees', {onDutyEmployees})
})

app.get('/terminated', (req, res) => {
	const terminatedEmployees = employeesRepo.getAllTerminated()
	res.render('terminated', {terminatedEmployees})
})

app.get('/employees/:id', (req, res) => {
	const id = req.params.id
	const employee = employeesRepo.getById(id)

	res.render('employee', { employee })
})

app.get('/employees/:id/edit', (req, res) => {
	const id = req.params.id
	const employee = employeesRepo.getById(id)

	res.render('edit', { employee, error: req.query.error })
})

app.post('/employees/:id/edit', (req, res) => {
	const updatedEmployee = {
		id: req.params.id,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
    email: req.body.email,
    position: req.body.position,
		wage: req.body.wage,
    comment: req.body.comment,
		status: req.body.status
	}

	employeesRepo.update(updatedEmployee.id, updatedEmployee, (err) => {
		if (err || updatedEmployee.invalidInput) {
			res.redirect('/employees/' + updatedEmployee.id + '/edit?error=true')
		} else {
			res.redirect('/employees/' + updatedEmployee.id)
		}
	})
})

app.listen(3000, () => console.log("App is running on port 3000"))