const Photo = require('../Models/GalleryModel');
const fs = require('fs').promises;
const path = require('path');

const uploadPhotos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const templeId = req.params.templeId;
        const photos = [];

        for (const file of req.files) {
            const photo = new Photo({
                temple: templeId,
                filename: file.filename,
                originalname: file.originalname,
                path: `api/${file.path}`,
                caption: req.body.caption || ''
            });

            await photo.save();
            photos.push(photo);
        }

        res.status(201).json({
            message: 'Photos uploaded successfully',
            photos: photos
        });
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ message: 'Error uploading photos', error: error.message });
    }
};

const getTemplePhotos = async (req, res) => {
    try {
        const photos = await Photo.find({ temple: req.params.templeId })
            .sort({ createdAt: -1 });
        res.json(photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ message: 'Error fetching photos' });
    }
};

const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        // Correct path handling
        const filePath = path.join(__dirname, '..', photo.path.replace('api/', ''));

        // Delete file from filesystem
        await fs.unlink(filePath);

        // Delete from database
        await Photo.findByIdAndDelete(req.params.photoId);

        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ message: 'Error deleting photo' });
    }
};

const updatePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const photo = await Photo.findById(req.params.photoId);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        // Correct path handling
        const oldFilePath = path.join(__dirname, '..', photo.path.replace('api/', ''));

        // Delete old file
        await fs.unlink(oldFilePath);

        // Update photo with new file details
        photo.filename = req.file.filename;
        photo.originalname = req.file.originalname;
        photo.path = `api/${req.file.path}`; // Ensure path consistency

        await photo.save();

        res.json({
            message: 'Photo updated successfully',
            photo,
        });
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).json({ message: 'Error updating photo', error: error.message });
    }
};

module.exports = {
    uploadPhotos,
    getTemplePhotos,
    deletePhoto,
    updatePhoto
};

