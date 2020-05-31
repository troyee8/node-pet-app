const express = require('express');
const Joi = require('@hapi/joi');

const Pets = require('../models/pets');
const { validateBody } = require('../middlewares/route');

const router = express.Router();


/**
 * To create a pet profile using POST method
 */
router.post('/',
  validateBody(Joi.object().keys({
    _id: Joi.required().description('Pet id'),
    name: Joi.string().required().description('Pet name'),
    age: Joi.number().integer().required().description('Pet age'),
    colour: Joi.string().required().description('Pet colour'),
  }),
  {
    stripUnknown: true,
  }),
  async (req, res, next) => {
    try {
      const pet = new Pets(req.body);
      await pet.save();
      res.status(200).json(pet);
    } catch (e) {
      next(e);
    }
  }
);


/**
 * To get all pets using GET method
 */
router.get('/', async (req, res) => {
  try {
    const pets = await Pets.find();
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).send('Network error');
  }
});


/**
 * To get a pet by id using GET method
 */
router.get('/:id', async (req, res) => {
  try {
    const pets = await Pets.findById(req.params.id);
    res.status(200).json(pets);
  } catch (err) {
    return res.status(500).json({message:'No pets found'});
  }
});


/**
 * To delete a pet using DELETE method
 */
router.delete('/:id', async (req, res) => {
  try {
    const pets = await Pets.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Pet Succesfully Deleted' });
  } catch (err) {
    res.status(500).json({message:'Not a valid pet'});
  }
});


module.exports = router;