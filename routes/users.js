import express from 'express';
import Papa from 'papaparse';

const router = express.Router();

let users = [
    {name: 'Cathy', salary: 4000},
    {name: 'Alex', salary: 3000},
    {name: 'Bryan', salary: 3500},
    {name: 'Gary', salary: 4000},
    {name: 'Ella', salary: 5000},
    {name: 'fiona', salary: 4500},
    {name: 'Dave', salary: 3000},
];

router.get('/users', (req, res) => {
    const min = parseInt(req.query.min) || 0; //min>=0
    const max = parseInt(req.query.max) || 4000; //max>=min
    const offset = parseInt(req.query.offset) || 0; //offset>=0
    const limit = parseInt(req.query.limit) || -1; //limit must be larger than 0
    const sort = String(req.query.sort).toUpperCase() || 'NONE';

    let results = users;
    results = results.slice(offset); //offset applied after filtering by salary range
    results = results.filter(user => user.salary >= min && user.salary <= max);
    
    if (limit != -1) {
        results = results.slice(0, limit);
    }

    if (sort === 'NAME') {
        results = results.sort((a, b) => {
            const nameA = a.name.toUpperCase(); //sorting is non-case senstive
            const nameB = b.name.toUpperCase();

            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else return 0;
        })
    } else if (sort === 'SALARY') {
        results = results.sort((a, b) => a.salary - b.salary);
    }

    res.status(200).json({"results": results});
});

router.post('/users', (req, res) => {
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
                    //error message here
                    res.status(400).json({"success": 0});
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
})

export default router;