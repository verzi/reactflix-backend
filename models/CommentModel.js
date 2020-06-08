var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    movieId: {
        type: String,
        required: [true, 'El ID de la película es requerido']
    },
    datetime:{
        type: Date,
        default: Date.now
    },
    comment:{
        type: String,
        required: [true, 'El campo Comentario es requerido']
    },
    user : {
        _id:{
            type: String,
            required: [true, 'El ID del usuario es requerido']
        },
        firstname: {
            type: String,
            required: [true, 'El campo Nombre del usuario es requerido']
        },
        lastname:{
            type: String,
            required: [true, 'El campo Apellido del usuario es requerido']
        }
    }
});

commentSchema.plugin(uniqueValidator, { message: 'El valor {VALUE} ya existe' });

var Comments = mongoose.model('Comment', commentSchema);
module.exports = Comments;