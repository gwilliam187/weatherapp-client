import React from 'react';
import { connect } from 'react-redux';

import { fetchWeathersForSelectedCities } from '../actions';
import CityList from './CityList';
import CityInput from './CityInput';
import WeatherDisplay from './WeatherDisplay';
import DiffDisplay from './DiffDisplay';

import './custom-style.css';

class App extends React.Component {
	componentDidUpdate() {
		this.props.fetchWeathersForSelectedCities();
	}

	renderWeatherDisplay() {
		if(this.state.cityList.length === 1) {
			return (
				<div className='row'>
					<div className='col-12 pb-3'>
						<WeatherDisplay />
					</div>
				</div>
			);
		} else if(this.state.cityList.length === 2) {
			return (
				<div className='row'>
					<div className='col-md-12 col-lg-6 pb-3'>
						<WeatherDisplay />
					</div>
					<div className='col-md-12 col-lg-6 pb-3'>
						<WeatherDisplay />
					</div>
				</div>
			);
		}
	}

	renderDiffDisplay() {
		if(this.state.tempList.length === 2) {
			return (
				<div className='row'>
					<div className='col-12'>
						<DiffDisplay tempList={this.state.tempList} windList={this.state.windList} />
					</div>
				</div>
			);
		}
	}

	render() {
		return (
			<div className="container app">
				<div className='row w-100'>
					<div className='col-4 shadow city-button-wrapper'>
						<div className='row header'>
							<div className='col-12 my-4'>
								<h1>Cities</h1>
							</div>
							<CityList />
							<CityInput />
						</div>
					</div>
					<div className='col-8'>
						<WeatherDisplay />
						<DiffDisplay />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedCities: state.selectedCities
	};
};

export default connect(
	mapStateToProps,
	{ fetchWeathersForSelectedCities }
)(App);