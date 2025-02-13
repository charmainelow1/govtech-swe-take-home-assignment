import express from 'express';
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

export default router;