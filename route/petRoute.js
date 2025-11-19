const express = require('express');
const router = express.Router();
const { allPets,getPetsByType, getPetById, addPet, updatePet, deletePet } = require('../controller/petController'); 

//middleware
const {checkAdminRole } = require('../middleware/userMiddleware');

//public route
router.get('/all', allPets);
router.get('/type/:type', getPetsByType);
router.get('/pet/:id', getPetById);

//admin route
router.post('/add', checkAdminRole, addPet);  
router.put('/update/:id', checkAdminRole,updatePet);  
router.delete('/delete/:id', checkAdminRole, deletePet);  

module.exports = router;
