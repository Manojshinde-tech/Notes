var notesRouter = (function () {
    'use strict';

    var express = require('express'),
        notesServerController = require('../controller/notes.server.controller'),
        notesRouter = express.Router(),
        HTTPStatus = require('http-status'),
        messageConfig = require('../config/api.messages.config.js');

    //--------------------------------Notes_Service----------------------------

    //Post Notes
    notesRouter.route('/Notes/')
    .get(AllNotesDetails)
        .post(notesServerController.postNotes);
  
    //Get All Notes
    //function declaration to return Notes list, if exists, else return not found message
     function AllNotesDetails(req, res, next) {
       notesServerController.getallNotes(req,res ,next)
            .then(function (NotesList) {
                //if exists, return data in json format
                if (NotesList) {
                    res.status(HTTPStatus.OK);
                    res.json(NotesList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.notes.notFoundNotes
                    });
                }
            })
            .catch(function (err) {
                return next(err);
            });
    };


    //Get by Any record from notes find query
    //function declaration to return notes list, if exists, else return not found message
    notesRouter.use('/ByAnySerach/', function (req, res, next) {
        notesServerController.getByAnySerach(req, next)
            .then(function (List) {
                //if exists, return data in json format
                if (List) {
                    res.status(HTTPStatus.OK);
                    res.json(List);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.notes.notFoundNotes
                    });
                }
            })
            .catch(function (err) {
                return next(err);
            });
    });


    notesRouter.use('/allNotes/:id', function (req, res, next) {
        notesServerController.getNotesId(req)
            .then(function (notesInfo) {
                // saving in request object so that it can be used for other operations like updating 
                // data using put and patch method
                if (notesInfo) {
                    req.notesInfo = notesInfo;
                    next();
                    return null;
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.notes.notFoundNotes
                    });
                }
            })
            .catch(function (err) {
                return next(err);
            });
    });

    // defining route that used above 
    notesRouter.route('/allNotes/:id')

        // GET COMMENTS
        .get(function (req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.notesInfo);
        })


        // DELETE Keyword
        .patch(notesServerController.patchNotes)


        // UPDATE Notes
        .put(notesServerController.updateNotes);


   // PAGINATION
   notesRouter.route('/getNotespagination/')
   .get(getAllNotestWithPagination)

function getAllNotestWithPagination(req, res, next) {
    notesServerController.getAllNotestWithPagination(req, next)
       .then(function (Noteslist) {
           //if exists, return data in json format
           if (Noteslist) {
               res.status(HTTPStatus.OK);
               res.json(Noteslist);

           } else {
               res.status(HTTPStatus.NOT_FOUND);
               res.json({
                   message: messageConfig.notesService.notFoundNotesService
               });
           }
       })
       .catch(function (err) {
           return next(err);
       });
}   

    return notesRouter;
})();

module.exports = notesRouter;