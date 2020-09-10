const express = require('express');
const multer = require('multer');
const multerConfig = require('../utils/multerConfig');

const Files = require('../models/filesModel');

const router = express.Router();

router
  .route('/')
  .post(multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = '' } = req.file;
    const file = await Files.create({
      name,
      size,
      key,
      url,
    });
    return res.json(file);
  });

router.route('/').get(async (req, res) => {
  const files = await Files.find();
  return res.json(files);
});

router.route('/:id').delete(async (req, res) => {
  const file = await Files.findById(req.params.id);

  await file.remove();

  return res.send();
});

module.exports = router;
