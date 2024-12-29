const { Schema, model } = require("mongoose");

const GallerySchema = new Schema({
    temple: {
        type: Schema.Types.ObjectId,
        ref: 'Temple',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Gallery = model('Gallery', GallerySchema);

module.exports = Gallery;



