import _ from 'lodash';


import { selectCity, unselectCity, addCity } from './cityActions';
import { fetchWeather, setWeathers } from './weatherActions';

import { schema } from '../Schema';

//RxDB Stuff Here
import * as RxDB from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));
const syncURL = 'http://192.168.200.46:5984/';

const dbName = 'the_awesome_weather_app';

export const initialiseRxDB = () => async (dispatch)=>{
	const db = await RxDB.create(
		{name: dbName, adapter: 'idb', password: 'password'}
	);
	
	db.waitForLeadership().then(() => {
		document.title = '♛ ' + document.title;
	});
	const userCollection = await db.collection({
		name: 'usercollection',
		schema: schema
	})
	// userCollection.insert({
	// 	_id: 'Steven',
	// 	cities: [
	// 		{
	// 			cityName: "Bogor",
	// 			cityRef: "bogor,id"
	// 		},
	// 		{
	// 			cityName: "Jakarta",
	// 			cityRef: "jakarta,id"
	// 		},
	// 		{
	// 			cityName: "Potsdam",
	// 			cityRef: "Potsdam,de"
	// 		},
	// 		{
	// 			cityName: "Soest",
	// 			cityRef: "Soest,de"
	// 		}
	// 	]
	// })

	userCollection.sync({ remote: syncURL + dbName + '/' });

	db.usercollection.find().$.subscribe( user => {
		if	(!user){
			return;
		}
		console.dir(user)
	} );

	let cities = await db.usercollection.findOne({_id: {$eq: 'John'}}).exec();
	dispatch(addCity(cities))

	//return db;
}
// --- end of RxDB stuff

// Selected City Actions
export { selectCity };
export { unselectCity };

// Weather Actions
export { fetchWeather, setWeathers };


export const fetchWeathersForSelectedCities = () => async (dispatch, getState) => {
	const selectedCities = getState().selectedCities;
	const promises = await selectedCities.map(async selectedCity => {
		const res = await dispatch(fetchWeather(selectedCity.cityRef));
		return res;
	});

	Promise.all(promises)
		.then(res => {
			let error = {};
			const weathers = res
				.map(currRes => {
					if('status' in currRes) {
						return currRes.data
					} else {
						// dispatch(unselectCity(currRes.city));
						error.city = currRes.city;
						return undefined;
					}
				})
				.filter(weather => {
					return weather !== undefined;
				});

			dispatch(setWeathers(weathers));

			if(!_.isEmpty(error)) {
				dispatch(updateCitiesErrorMessage(error.city, 'CITY_NOT_FOUND'));
			}
		})
		.catch(err => { 
			console.log(err); 
		});
};

export const updateCitiesErrorMessage = (city, status) => {
	if(status === 'CITY_NOT_FOUND') {
		return {
			type: 'CITY_NOT_FOUND'
		};
	} else if(status === 'INVALID_INPUT') {
		return {
			type: 'INVALID_INPUT'
		};
	}

	return {
		type: 'ALLES_GUT'
	};
};