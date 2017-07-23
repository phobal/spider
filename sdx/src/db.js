/*
* @Author: fengbo
* @Date:   2017-07-08 16:51:27
* @Last Modified by:   fengbo
* @Last Modified time: 2017-07-08 17:59:33
*/

'use strict';

const mongo = require('mongodb');
const promise = module.exports = mongo.connect('mongodb://localhost:27017/sdx_shanghai');

process.on('SIGINT', ()=> {
	promise.then(db=> {
		db.close(() =>{
			console.log('database has closed!')
		})
	})
});