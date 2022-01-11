const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoticiaSchema = new Schema({
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image_author: String,
    image_news: {
        type: String,
        required: true,
    },
    created_at: { 
        type : Date,
        default: Date.now,
        required: true
    },
    updated_at: {
        type : Date,
        default: Date.now,
        required: true
    }
}, { collection: 'noticias' });

const Noticia = mongoose.model('noticias', NoticiaSchema);

module.exports = Noticia;
