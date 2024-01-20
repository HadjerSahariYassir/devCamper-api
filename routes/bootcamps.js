const express = require("express");
const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");
const { protect, authorize }= require('../middleware/auth');
// Include other resource router
const courseRouter = require('./courses');

const router = express.Router();

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootCamps).post(protect, authorize('publisher', 'admin'), createBootCamp)

router.route('/:id').get(getBootCamp).put(protect, authorize('publisher', 'admin'), updateBootCamp).delete(protect,authorize('publisher', 'admin'), deleteBootCamp)

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router
