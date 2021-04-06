const fs = require('fs')

class employeesRepository {
  constructor() {
    this.employeesDb = []

    fs.readFile('./data/employees.json', (err, data) => {
			if (!err) {
				this.employeesDb = JSON.parse(data)
			}
		})
  }

  // function for adding an employee to the json file
  add(employee, callback) {
    employee.id = this.generateRandomId()

    if (this.validInputs(employee)){
      this.employeesDb.push(employee)
      this.updateFile(callback)
    } else {
      // in case of errors do not add to the file and let the user know
      employee.invalidInput = true;
      callback()
    }
  }

  getAllEmployees() {
    return this.employeesDb.filter(employee => !employee.terminated)
  }

  getAllOnDuty() {
    return this.employeesDb.filter(employee => employee.status === 'On Duty' && !employee.terminated)
  }

  getAllVacation() {
    return this.employeesDb.filter(employee => employee.status === 'Vacation' && !employee.terminated)
  }

  getAllMedication() {
    return this.employeesDb.filter(employee => employee.status === 'Medication' && !employee.terminated)
  }

  getAllTerminated() {
    return this.employeesDb.filter(employee => employee.terminated === true)
  }

  // generating random ID to the employee
  generateRandomId() {
    return '_' + Math.random().toString(36).substr(2,9)
  }

  getById(id) {
    return this.employeesDb.find(employee => employee.id === id)
  }

  update(id, updatedEmployee, callback) {
    // find the index of the employee
    const index = this.employeeIndex(id)

    if(this.validInputs(updatedEmployee)){
      // implement updates to the employee with the updates
      this.employeesDb[index] = updatedEmployee
      // update the whole json file
      this.updateFile(callback)
    } else {
      updatedEmployee.invalidInput = true
      callback()
    }
  }

  terminate(id, employee, callback) {
    const index = this.employeeIndex(id)

    // passing by reference
    this.employeesDb[index] = employee
    employee.terminated = true
    this.updateFile(callback)
  }

  hireBack(id, employee, callback) {
    const index = this.employeeIndex(id)

    // passing by reference
    this.employeesDb[index] = employee
    employee.terminated = false
    this.updateFile(callback)
  }

  delete(id, callback) {
    const index = this.employeeIndex(id)

    // delete one element from the employeesDB
    this.employeesDb.splice(index, 1)
    this.updateFile(callback)
  }

  validInputs(employee){
    if(employee.firstName.trim() === '' || employee.lastName.trim() === '' || employee.email.trim() === '' || employee.wage < 7 || employee.wage > 100){
      return false
    } else {
      return true
    }
  }

  updateFile(callback){
    fs.writeFile('./data/employees.json', JSON.stringify(this.employeesDb), callback)
  }

  // to avoid repetition (DRY rule)
  employeeIndex(id) {
    return this.employeesDb.findIndex( employee => employee.id === id)
  }
}

module.exports.employeesRepository = employeesRepository