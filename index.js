/*
* @Author: fengbo
* @Date:   2017-07-08 17:00:42
* @Last Modified by:   fengbo
* @Last Modified time: 2017-07-08 18:31:16
*/

'use strict';

const fetch = require('node-fetch');
const superagent = require('superagent');

const dbPromise = require('./src/db');
const params = require('./src/params');

function main(){
	capture();
}

const capture = () => {
	const url =`https://epass.sdxpass.com/server/mlocator/getMerchantStores`;
	superagent
		.post(url)
		.send(params)
		.end((err, resp) => {
			const items = JSON.parse(resp.text).stores;
			save(items);
		})
}

const save = (items) => {
	return dbPromise.then(db => {
		let business = db.collection('business');
		let updates = 0, inserts = 0;

		let promises = items.map(item => {
			let _id = item.storeId;
			if(!_id) {
				console.log('_id is null' + JSON.stringify(item))
				return;
			}
			delete item.storeId;

			business.updateOne({ _id: _id }, { $set: item }, { w: 1, upsert: true});
		}) 
	})
}

main();