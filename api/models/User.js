/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var bcrypt = require('bcrypt');

 module.exports = {

     attributes: {
         fullName: {
             type: 'string'
         },
         email: {
             type: 'email'//,
            //  required: true,
            //  unique: true
         },
         password: {
             type: 'string',
             required: true,
             minLength: 6
         },
         address: {
             type: 'string'//,
            //  required: true
         },
         mobileNumber: {
             type: 'string'//,
            //  required: true
         },
         isDeleted: {
             type: 'boolean',
             defaultsTo: false
         },
         validPassword(password, callback) {
             var obj = this.toObject();
             if (callback) {
                 return bcrypt.compare(password, obj.password, callback);
             }
             return bcrypt.compareSync(password, obj.password);
         },
         toJSON() {
             var obj = _.clone(this);
             delete obj.password;
             return obj;
         }
     },

     beforeCreate(values, cb) {
         if (!values.password)
         return cb();

         bcrypt.hash(values.password, 10, function(err, hash) {
             if(err) return cb(err);
             values.password = hash;
             cb();
         });
     },

     /**
     * Soft delete a record
     * @param {[type]}   criteria query
     * @param {Function} cb       callback function
     */
     softDelete: function(criteria){
         return this.update(criteria, { isDeleted: true });
     },

     validationMessages: {
         fullName: {
             required: 'Your Full Name is required'
         },
         email: {
             email: 'Please enter a valid Email',
             required: 'Email is required',
             unique: "User with the Email exist"
         },
         password: {
             required: 'Password is required',
             minLength: 'Password is too short. Minimum length is 6'
         },
         address: {
             required: 'Address of the User is required'
         },
         mobileNumber: {
             required: 'The Mobile Number of the User is required'
         }
     }
 };
