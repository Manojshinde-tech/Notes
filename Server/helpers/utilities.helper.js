(function (utilityHelper) {
    'use strict';

    utilityHelper.isInteger = function (val) {
        var intRegex = /^\d+$/;
        return intRegex.test(val.toString());
    };

    utilityHelper.getPaginationOpts = function (req, next) {
        try {

            // req.query.perpage = '';
            var pagerOpts = {};
            if (req.query.perpage && utilityHelper.isInteger(req.query.perpage)) {
                pagerOpts.perPage = parseInt(req.query.perpage);
            } else {
                pagerOpts.perPage = 5;
            }
            
            if (req.query.page && utilityHelper.isInteger(req.query.page)) {
                pagerOpts.page = parseInt(req.query.page);
            } else {
                pagerOpts.page = 1;
            }
            return {
                perPage: pagerOpts.perPage,
                page: pagerOpts.page
            };
        } catch (err) {
            // return  next(err);
        }
    };

})(module.exports);