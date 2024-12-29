const express = require('express');
const router = express.Router();
const photoController = require('../Controllers/GalleryController');
const upload = require('../Config/multer');

// Upload photos (max 4)
router.post('/upload/:templeId', upload.array('photos', 4), photoController.uploadPhotos);

// Get all photos for a temple
router.get('/temple/:templeId', photoController.getTemplePhotos);

// Delete a photo
router.delete('/:photoId', photoController.deletePhoto);

// Update photo caption
router.put('/:photoId/caption', photoController.updatePhotoCaption);

module.exports = router;



