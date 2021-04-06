const express = require('express')
const router = express.Router()
const { employeesRepository } = require('../public/js/employees_repo')
const employeesRepo = new employeesRepository()

router.use(express.urlencoded({ extended: false}))

// the same as /employees
router.get('/', (req, res) => {
	const employees = employeesRepo.getAllEmployees()
	res.render('employees', { employees })
})

// /employees/:id
router.get('/:id', (req, res) => {
	const id = req.params.id
	const employee = employeesRepo.getById(id)

	res.render('employee', { employee })
})

// /employees/:id:edit
router.route('/:id/edit')
  .get((req, res) => {
    const id = req.params.id
    const employee = employeesRepo.getById(id)

    res.render('edit', { employee, error: req.query.error })
  })
  .post((req, res) => {
    // store updated employee information in a new object
    const updatedEmployee = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      position: req.body.position,
      wage: req.body.wage,
      comment: req.body.comment,
      status: req.body.status,
      terminated: false,
      id: req.params.id
  }

  // updae an existing employee with the object values from the variable above
	employeesRepo.update(updatedEmployee.id, updatedEmployee, (err) => {
		if (err || updatedEmployee.invalidInput) {
			res.redirect('/employees/' + updatedEmployee.id + '/edit?error=true')
		} else {
			res.redirect('/employees/' + updatedEmployee.id)
		}
	})
})

// /employees/:id/terminate
router.get('/:id/terminate', (req, res) => {
	const id = req.params.id
	const employee = employeesRepo.getById(id)

  // in a json file, set termidate value of an employee to true
	employeesRepo.terminate(employee.id, employee, (err) => {
		if (err) {
			res.redirect('/terminated?fail=true')
		} else {
      const terminatedEmployees = employeesRepo.getAllTerminated() 
      res.render('terminated', { terminatedEmployees })
		}
	})
})

router.get('/:id/hireBack', (req, res) => {
	const id = req.params.id
	const employee = employeesRepo.getById(id)

	employeesRepo.hireBack(id, employee, (err) => {
		if (err) {
			res.redirect('/terminated?error=true')
		} else {
			res.redirect('/employees')
		}
	})
})

router.get('/:id/view', (req, res) => {
	const id = req.params.id
	const employee = employeesRepo.getById(id)

	res.render('view', { employee })
})

router.get('/:id/delete', (req, res) => {
	const id = req.params.id

	employeesRepo.delete(id, (err) => {
		if (err) {
			res.redirect('/terminated?error=true')
		} else {
      res.redirect('/terminated')
		}
	})
})

module.exports = router;