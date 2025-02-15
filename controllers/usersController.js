import Papa from 'papaparse';
import userQuerySchema from '../models/usersQuery.js';

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
        error.status = 400
        return next(error);     
    }

    let results = users;
    results = results.slice(validationValue.offset); //offset applied after filtering by salary range
    results = results.filter(user => user.salary >= validationValue.min && user.salary <= validationValue.max);
    
    if (validationValue.limit != -1) {
        results = results.slice(0, validationValue.limit);
    }

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
    }

    res.status(200).json({"results": results});
}

// @desc Add new users
// @route POST /users
export const addUsers = (req, res, next) => {
    const csvString = String(req.body.file); //works in JSON but not url-encoded format
    const fixedHeader = ['name', 'salary'];

    const parsedData = Papa.parse(
        csvString, 
        {   header: true,
            transformHeader: (header, i) => fixedHeader[i],
            delimiter: ",",
            complete: (results) => {
                let data = results.data;

                //ensure every row has 2 columns
                const validData = data.every( record => Object.keys(record).length === 2 );

                if (!validData) {
                    const error = new Error('CSV File is incorrectly formatted');
                    error.status = 400
                    return next(error);
                } else {
                    //ensure that salary >= 0, or else discard row
                    data.forEach( record => record.salary = parseFloat(record.salary) );
                    data = data.filter( record => record.salary >= 0 );
                
                    //add new data into existing user records
                    data.forEach( record => {
                        const existingUser = users.find(user => user.name.toLowerCase() === record.name.toLowerCase());
                
                        if (typeof existingUser === 'undefined') {
                            users.push(record);
                        } else {
                            existingUser.salary = record.salary;
                        }
                    })

                    res.status(201).json({"success": 1})
                }
            }
        }
    );
}