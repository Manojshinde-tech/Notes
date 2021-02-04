(function (providerHelper) {

    'use strict';
    var Promise = require("bluebird"),
    join = Promise.join,
    mongoose = require("mongoose");
    Promise.promisifyAll(mongoose);

    
    // SAVE
    providerHelper.save = function (newModelData) {
        return new Promise(function (resolve, reject) {
            return newModelData.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve('successfully created ');
                }
            });
        });
    };

    // CHECKS FOR DUPLICATES
    providerHelper.checkForDuplicateEntry = function (Model, queryOpts) {
        return Model.count(queryOpts)
    };

    // FIND BY ID 
    providerHelper.findById = function (Model, query, popdocumentFieldsNotes) {
        return Model.findById(query, popdocumentFieldsNotes);
    };

    providerHelper.find = function (Model, queryOpts, documentFields) {
        return Model.findAsync(queryOpts, documentFields)
    };
 

     //Get All Notes
     providerHelper.getallNotes = function (Model,query, documentFieldsNotes, ) {
        return join(Model
            .find(query)
            .select(documentFieldsNotes),
            function (dataList) {
                return {
                    dataList: dataList,
                };

            });
    };
     //Get by source record
     providerHelper.getBySource = function (Model,query, documentFieldsNotes, ) {
        return join(Model
            .find(query)
            .select(documentFieldsNotes),
            function (dataList) {
                return {
                    dataList: dataList,
                };
            });
    };
    
 //pagination
 providerHelper.getAllNotesWithPagination = function (Model, query, pagerOpts, documentFields, sortOpts) {
    return join(Model
        .find(query)
        .select(documentFields)
        .skip(pagerOpts.perPage * (pagerOpts.page - 1))
        .limit(pagerOpts.perPage)
        .sort(sortOpts)
        .execAsync(),
        Model.count(query)
        .execAsync(),
        function (dataList, count) {
            return {
                dataList: dataList,
                totalItems: count,
                currentPage: pagerOpts.page
            };
        });

    }
        //Get by title record
        providerHelper.getByTitle = function (Model,query, documentFieldsNotes, ) {
            return join(Model
                .find(query)
                .select(documentFieldsNotes),
                function (dataList) {
                    return {
                        dataList: dataList,
                    };
                });
        };


        //pagination
        providerHelper.getAllNotesWithPagination = function (Model, query, pagerOpts, documentFields, sortOpts) {
            return join(Model
                .find(query)
                .select(documentFields)
                .skip(pagerOpts.perPage * (pagerOpts.page - 1))
                .limit(pagerOpts.perPage)
                .sort(sortOpts)
                .execAsync(),
                Model.count(query)
                .execAsync(),
                function (dataList, count) {
                    return {
                        dataList: dataList,
                        totalItems: count,
                        currentPage: pagerOpts.page
                    };
                });
        
            }


         //Get by Date record
         providerHelper.getByAnySerach = function (Model,query, documentFieldsNotes, ) {
            return join(Model
                .find(query)
                .select(documentFieldsNotes),
                function (dataList) {
                    return {
                        dataList: dataList,
                    };
                });
        };
})(module.exports);