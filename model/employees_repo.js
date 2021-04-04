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

  add(employee, callback) {
    employee.id = this.generateRandomId()

    if (this.validInputs(employee)){
      this.employeesDb.push(employee)
      this.updateFile(callback)
    } else {
      employee.invalidInput = true;
      callback()
    }
  }

  getAllOnDuty() {
    return this.employeesDb.filter(employee => employee.status === 'On Duty')
  }

  getAllTerminated() {
    return this.employeesDb.filter(employee => employee.status === 'Terminated')
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
    const index = this.employeesDb.findIndex(employee => employee.id === id)

    if(this.validInputs(updatedEmployee)){
      // implement updates to the employee with the updates
      this.employeesDb[index] = updatedEmployee
      // update the whole json file
      this.updateFile(callback)
    } else {
      updatedEmployee.invalidInput = true;
      callback()
    }
  }

  validInputs(employee){
    if(employee.firstName.trim() === '' || employee.lastName.trim() === ''){
      return false
    } else {
      return true
    }
  }

  updateFile(callback){
    fs.writeFile('./data/employees.json', JSON.stringify(this.employeesDb), callback)
  }
}

module.exports.employeesRepository = employeesRepository