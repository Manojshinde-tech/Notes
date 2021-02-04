(function () {
    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var notesSchema = new Schema({
       notesId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
       name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
    
        date: {
            type: Date,
            default: Date.now
        },
       
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        addedOn: {
            type: Date, 
        },
      updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true
        },
        updateOn: {
            type: Date, 
        },
        deleteOn: {
            type: Date, 
        },
        isDeleted: {
            type: Boolean,
            default: false
        },

    });
  
    module.exports = {
        Notes: mongoose.model('Notes', notesSchema),
       
    };

})();