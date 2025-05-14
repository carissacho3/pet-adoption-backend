const express = require('express');
const router = express.Router();
const { allPets,getPetsByType, addPet, updatePet, deletePet } = require('../controller/petController'); 

//middleware
const { protect,checkAdminRole } = require('../middleware/userMiddleware');

//public route
router.get('/all', allPets);
router.get('/type/:type', getPetsByType);

//admin route
router.post('/add', protect,checkAdminRole, addPet);  
router.put('/update/:id', protect, checkAdminRole,updatePet);  
router.delete('/delete/:id',protect, checkAdminRole, deletePet);  

module.exports = router;
