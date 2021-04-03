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
      employee.inValidInput = true;
      callback()
    }
  }

  // generating random ID to the employee
  generateRandomId() {
    return '_' + Math.random().toString(36).substr(2,9)
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