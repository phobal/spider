/*
* @Author: fengbo
* @Date:   2017-07-08 17:14:42
* @Last Modified by:   fengbo
* @Last Modified time: 2017-07-08 18:16:19
*/

'use strict';

const params = {
    adminDistrict: '',
    businessDistricts: [],
    currentPageNumber: 1,
    lat: 31.24916171,
    lng: 121.48789949,
    maxDistance: 5000,
    paymentMode: {
        Card: false,
        Mobile: false,
    },
    recordsPerPage: 5000,
    sortByMostPopular: true,
    sortByMostViewed: false,
    storeType: "meal",
    subCategory: [],
}
module.exports = params;