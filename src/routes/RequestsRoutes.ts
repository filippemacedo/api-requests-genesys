import express from 'express'
import RequestsController from '../controllers/RequestsController'
import cron from '../cron/cron'

const router = express.Router()

router.get('/cron', cron)
router.route('/').post(RequestsController.getRequests).get(RequestsController.getAllRequests)
router.route('/:userId').get(RequestsController.getUserByUserId)

export default router