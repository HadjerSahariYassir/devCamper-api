//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   Public
exports.getBootCamps = (req, res, next) => {
<<<<<<< HEAD
  res.status(200).send({ success: true, msg: "get all bootcamps" });
};
=======
    res.status(200).send(({ success: true, msg: "get all bootcamps", hello: req.hello}))
}
>>>>>>> f0b09a1b950dbf756f81d40c66aa8dea6dbe2c92

//@desc     Get single bootcamps
//@route    Get /api/v1/bootcamps/:id
//@access   Public
exports.getBootCamp = (req, res, next) => {
  res.status(200).send({ success: true, msg: `get bootcamp ${req.params.id}` });
};

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootCamp = (req, res, next) => {
  res.status(201).send({ success: true, msg: "create a  new bootcamp" });
};

//@desc     Update single bootcamps
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootCamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, msg: `update bootcamp ${req.params.id}` });
};

//@desc     Delete single bootcamps
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootCamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, msg: `delete bootcamp ${req.params.id}` });
};
