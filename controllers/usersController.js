import userQuerySchema from '../models/users.js';
import rowSchema from '../models/rows.js';

let users = [
    {name: 'Cathy', salary: 4000},
    {name: 'Alex', salary: 3000},
    {name: 'Bryan', salary: 3500},
    {name: 'Gary', salary: 4000},
    {name: 'Ella', salary: 5000},
    {name: 'fiona', salary: 4500},
    {name: 'Dave', salary: 3000},
];

// @desc Get users
// @route GET /users
export const getUsers = (req, res, next) => {
    const validation = userQuerySchema.validate(req.query);
    const validationError = validation.error;
    const validationValue = validation.value;

    if (validationError) {
        const error = new Error(validationError.message);
        error.status = 400;
        return next(error);     
    };

    let results = users;
    results = results.slice(validationValue.offset); //offset applied after filtering by salary range
    results = results.filter(
        user => user.salary >= validationValue.min && user.salary <= validationValue.max
    );
    
    if (validationValue.limit != -1) {
        results = results.slice(0, validationValue.limit);
    };

    if (validationValue.sort.toUpperCase() === 'NAME') {
        results = results.sort((a, b) => {
            const nameA = a.name.toUpperCase(); //sorting is non-case senstive
            const nameB = b.name.toUpperCase();

            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else return 0;
        })
    } else if (validationValue.sort.toUpperCase() === 'SALARY') {
        results = results.sort((a, b) => a.salary - b.salary);
    };

    res.status(200).json({"results": results});
}

// @desc Add new users and update salary for existing users
// @route POST /users
export const addUsers = (req, res, next) => {
    const csvString = String(req.body.file);

    //convert csv string into array of objects
    let csvData = [];
    const rows = csvString.split('\\n'); //split into rows by newline character
    rows.shift(); //ignore first row

    for (let i=0; i<rows.length; i++) {
        const row = rows[i];
        const validation = rowSchema.validate(row);
        const validationError = validation.error;
    
        if (validationError) {
            const error = new Error(validationError.message);
            error.status = 400;
            return next(error);     
        };

        const values = row.split(',');
        const name = String(values[0]);
        const salary = parseFloat(values[1]);
        csvData.push({
            "name": name,
            "salary": salary
        });
    }

    //ensure that salary >= 0, or else discard row
    csvData = csvData.filter( record => record.salary >= 0 );

    //add new data into existing user records
    csvData.forEach( record => {
        const existingUser = users.find(
            user => user.name.toLowerCase() === record.name.toLowerCase()
        );

        if (typeof existingUser === 'undefined') {
            users.push(record);
        } else {
            existingUser.salary = record.salary;
        };
    })
    res.status(201).json({"success": 1});
}