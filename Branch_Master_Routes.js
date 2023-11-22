module.exports = app => {

    const Branch = require("../../controllers/Master_Controllers/Branch_Master_Controller");

    var router = require("express").Router()

    router.post('/add',Branch.BranchAdd);//Insert
    router.put('/update:id',Branch.Branchupdate);//Update
    router.get('/find',Branch.Branchfind);//Select
    router.delete('/delete:id',Branch.Branchdelete);//Delete

    app.use('/api/Branch', router);

}