var notesServerController = (function () {
    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        errorHelper = require('../helpers/error.helper'),
        messageConfig = require('../config/api.messages.config'),
        NotesModels = require('../models/notes.model'),
        Notes = NotesModels.Notes,
        utilityHelper = require('../helpers/utilities.helper'),
        mongoose = require('mongoose'),
        ObjectId = mongoose.Types.ObjectId,
        Promise = require("bluebird"),
        join = Promise.join;

    var documentFieldsNotes = '_id  name  description addedBy updateBy datePublished isDeleted feature';

    //---------------------Notes method----------
    function NotesModule() { }
    NotesModule.CreateNotes = function (req) {
        var notes = new notes();
        notes.name = req.body.name;
        notes.description = req.body.description;
        notes.date = new Date();
        notes.addedBy = req.body.addedBy;
        notes.addedOn = new Date();
        notes.updateBy = req.body.updateBy;
        notes.updateOn = new Date();
        notes.deleteOn = new Date();
        return notes;
    };

    var _p = NotesModule.prototype;
    _p.checkValidationErrors = function (req) {
        req.checkBody('name', messageConfig.validationErrMessage.notes).notEmpty();
        return req.validationErrors();
    };
    
    //    //post Notes method
    var _p = NotesModule.prototype;
    _p.postNotes = function (req, res, next) {
        if (req.body.name) {
            var errors = _p.checkValidationErrors(req);
            if (errors) {
                res.status(HTTPStatus.BAD_REQUEST);
                res.json({
                    message: errors
                });
            }
            var query = {};
            query.notes = req.body.name;
            dataProviderHelper.checkForDuplicateEntry(Notes, query)
                .then(function (count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.notes.alreadyExistsMessageNotes + '"}');
                    } else {
                        var notes = NotesModule.CreateNotes(req);
                        return dataProviderHelper.save(notes)
                    }
                })
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.notes.saveNotes
                    });
                })
                .catch(Promise.CancellationError, function (cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function (err) {
                    return next(err);
                });
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.notes.fieldRequiredNotes
            });
        }
    };

    // Notes find by id
    _p.getNotesId = function (req) {
        return dataProviderHelper.findById(Notes, req.params.id, documentFieldsNotes);
    };

    //Find All Notes
    _p.getallNotes = function (req) {
        var query = {};
        if (req.query.active) {
            query.active = true;
        }
        query.isDeleted = false;
        return dataProviderHelper.getallNotes(Notes, query, documentFieldsNotes);
    }
    //Find By Source in Notes
    _p.getByAnySerach = function (req) {
        var query = {};
        if (req.query) {
            query = req.query;
        }
        if (req.query.active) {
            query.active = true;
        }
        return dataProviderHelper.getByAnySerach(Notes, query, documentFieldsNotes);
    }
    //delete Notes
    _p.patchNotes = function (req, res, next) {
        req.notesInfo.isDeleted = true;
        dataProviderHelper.save(req.notesInfo)
            .then(function () {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.notes.deleteNotes
                });
            })
            .catch(Promise.CancellationError, function (cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function (err) {
                return next(err);
            });
    };

    //Update Notes
    _p.updateNotes = function (req, res, next) {
        var notes = NotesModule.CreateNotes(req);
        if (req.body.name) {
            return _p.updateNotesFunc(req, res, notes)
                .then(function () {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.notes.updateNotes
                    });
                })
                .catch(Promise.CancellationError, function (cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function (err) {
                    return next(err);
                });
        }
        else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.category.fieldRequiredCategory
            });
        }
    };

    _p.updateNotesFunc = function (req, res, notes) {
        req.notesInfo.name = notes.name;
        req.notesInfo.description = notes.description;
        req.notesInfo.addedBy = notes.addedBy;
        req.notesInfo.updateBy = notes.updateBy;
        req.notesInfo.addedOn = new Date();
        req.notesInfo.updatedOn = new Date();
        req.notesInfo.deleteOn = new Date();
        return dataProviderHelper.save(req.notesInfo);
    }


    //Paginaton
    _p.getAllnotestWithPagination = function (req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {}
        if (req.query.addedBy) {
            query.addedBy = req.query.addedBy
        }
        query.isDeleted = false;
        var sortOpts = {
            addedOn: -1
        };

        return dataProviderHelper.getAllNotestWithPagination(Notes, query, pagerOpts, documentFieldsNotes, sortOpts);

    }

    return {
        postNotes: _p.postNotes,
        getallNotes: _p.getallNotes,
        getNotesId: _p.getNotesId,
        updateNotes: _p.updateNotes,
        patchNotes: _p.patchNotes,
        getByAnySerach: _p.getByAnySerach,
        getAllNotestWithPagination: _p.getAllNotestWithPagination
    };
})();
module.exports = notesServerController;