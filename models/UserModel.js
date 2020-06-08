var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'El campo Nombre es requerido']
    },
    lastname:{
        type: String,
        required: [true, 'El campo Apellido es requerido']
    },
    email:{
        type: String,
        required: [true, 'El campo E-mail es requerido'],
        unique: [true, 'El E-mail ingresado ya existe'],
        uniqueCaseInsensitive: true
    },
    username:{
        type: String,
        required: [true, 'El campo Nombre de usuario es requerido'],
        unique: [true, 'El E-mail ingresado ya existe'],
        uniqueCaseInsensitive: true        
    },
    password:{
        type: String,
        required: [true, 'El campo Contraseña es requerido'],
    }
});

userSchema.plugin(uniqueValidator, { message: 'El valor {VALUE} ya existe' });

var Users = mongoose.model('User', userSchema);
module.exports = Users;