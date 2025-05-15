const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],  
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  typeofAnimal: {
    type: String,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit'],  
    required: true,
  },
  spayedOrNeutered: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,  
    required: false,  
  },
  location: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
 

});


const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
