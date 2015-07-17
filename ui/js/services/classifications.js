/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, you can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

treeherder.factory('thClassificationTypes', [
    '$http', 'thUrl',
    function($http, thUrl) {

        var classifications = {};
        var classificationOptions = [];

        var classificationColors = {
            1: "",                 // not classified
            2: "label-info",       // expected fail",
            3: "label-success",    // fixed by backout",
            4: "label-warning",    // intermittent",
            5: "label-default",    // infra",
            6: "label-danger"      // intermittent needs filing",
        };

        var addClassification = function(cl) {
            classifications[cl.id] = {
                name: cl.name,
                star: classificationColors[cl.id]
            };
            classificationOptions.push(cl);
        };

        var load = function() {
            return $http.get(thUrl.getRootUrl("/failureclassification/"), {cache: true}).
                success(function(data) {
                    _.forEach(data, addClassification);
                });
        };

        return {
            classifications: classifications,
            classificationOptions: classificationOptions,
            load: load
        };
    }]);

