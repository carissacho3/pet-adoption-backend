const expressAsyncHandler = require('express-async-handler');
const Pets = require('../database/petdb');

// @desc    Get all Pets
// @route   Get /api/pet/all
// @access  Public
const allPets = expressAsyncHandler(async (req, res) => {
    try {
        const pets = await Pets.find(); 

        if (pets) {
       
            res.status(200).json(pets);
        } else {
            res.status(404).json({ message: 'No pets found' });
        }
    } catch (error) {
     
        res.status(500).json({ message: 'Error fetching pets', error: error.message });
    }
});

// @desc    Get pets by type
// @route   GET /api/pet/type/:type
// @access  Public
const getPetsByType = expressAsyncHandler(async (req, res) => {
    const petType = req.params.type;

    try {
        const pets = await Pets.find({ typeofAnimal: petType });

        if (pets.length > 0) {
            res.status(200).json(pets);
        } else {
            res.status(404).json({ message: `No pets of type '${petType}' found` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pets by type', error: error.message });
    }
});

// @desc    Get pet by ID
// @route   GET /api/pet/:id
// @access  Public
const getPetById = expressAsyncHandler(async (req, res) => {
    const petId = req.params.id;

    try {
        const pet = await Pets.findById(petId);

        if (pet) {
            res.status(200).json(pet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pet by ID', error: error.message });
    }
});


// @desc    Add Pets
// @route   POST /api/pet
// @access  Admin
const addPet = expressAsyncHandler(async (req, res) => {
    const { name, sex, breed, color, weight, age, type, summary, typeofAnimal, spayedOrNeutered, image, location, phoneNumber} = req.body; 

    if ( !name || !sex || !breed || !color || !weight || !age || !type || !summary || !typeofAnimal || !spayedOrNeutered || !image || !location || !phoneNumber ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newPet = await Pets.create({
           name, sex, breed, color, weight, age, type, summary, typeofAnimal, spayedOrNeutered, image, location, phoneNumber
        });

        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ message: 'Error adding pet', error: error.message });
    }
});


// @desc   update Pets
// @route   UPDATE /api/pet/:id
// @access  Admin
const updatePet = expressAsyncHandler(async (req, res) => {
    const petId = req.params.id;
    const { name, sex, breed, color, weight,age, summary, type, sprayedorNeutered, location, phoneNumber } = req.body; 

    try {
        const pet = await Pets.findById(petId); 

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }


        pet.name = name || pet.name;
        pet.sex = sex || pet.sex;
        pet.breed = breed || pet.breed;
        pet.color = color || pet.color;
        pet.weight = weight || pet.weight;
        pet.typeofAnimal = type || pet.typeofAnimal;
        pet.age = age || pet.age;
        pet.summary = summary || pet.summary;
        pet.sprayedorNeutered = sprayedorNeutered || pet.sprayedorNeutered;
        pet.location = location || pet.location;
        pet.phoneNumber = phoneNumber || pet.phoneNumber;

        const updatedPet = await pet.save(); 

        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(500).json({ message: 'Error updating pet', error: error.message });
    }
});

// @desc   delete Pets
// @route   DELETE /api/pet/:id
// @access  Admin
const deletePet = expressAsyncHandler(async (req, res) => {
    const petId = req.params.id; 

    try {
        const pet = await Pets.findById(petId); 

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        await pet.remove(); 

        res.status(200).json({ message: 'Pet deleted successfully' }); 
    } catch (error) {
        res.status(500).json({ message: 'Error deleting pet', error: error.message });
    }
});

module.exports = { allPets,getPetsByType, getPetById, addPet, updatePet, deletePet };