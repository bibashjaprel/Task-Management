const express = require('express')
const router = express.Router()
const {getTasks, getSingleTasks, createTasks, updateTasks, deleteTasks} = require('../controllers/task.controllers')

//middlewarw 
const authMiddle = require('../middlewares/auth.middlewares')

//tasks routes
  //get all tasks
router.get('/', authMiddle, getTasks)

  //get single task
  router.get('/:id', authMiddle, getSingleTasks)

  //post  tasks
router.post('/', authMiddle, createTasks)

  //update  task
  router.patch('/:id', authMiddle, updateTasks)

  //delete  task
  router.delete('/:id', authMiddle, deleteTasks)

module.exports = router;
