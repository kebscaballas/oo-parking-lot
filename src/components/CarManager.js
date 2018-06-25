import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./../styles/CarManager.css";

class Car {
	constructor(plate, size, entryPoint, entryTime, exitTime, slotId) {
		this.plate = plate;
		this.size = size;
		this.entryPoint = entryPoint;
		this.entryTime = entryTime;
		this.exitTime = exitTime;
		this.slotId = slotId;
	}
}

class AddCarForm extends Component {
	constructor(props) {
		super(props);
	
		this.state = {};

		this.addCarValidation = this.addCarValidation.bind(this);
	}

	addCarValidation(carSize, plate, entryPoint) {
		let carHistory = this.props.carHistory;
		let parkingMap = this.props.parkingMap;
		let errorFlag = false;
		for(let i = 0; i < carHistory.length; i++) {
			if(carHistory[i].plate === plate && !carHistory[i].exitTime) {
				errorFlag = true;
			}
		}
		if(plate === "") {
			errorFlag = true;
		} 
		for(let j = 0; j < parkingMap.length; j++) {
			if(parkingMap[j].occupied != null && j === parkingMap.length - 1) {
				errorFlag = true;
			}
		}


		if(!errorFlag) {
			var car = new Car(plate, carSize, entryPoint, new Date());
			this.props.addCar(car);
		}
	}

	render(){
		let entranceOption = [];
		let entranceCount = this.props.entranceCount;
		let parkingMap = this.props.parkingMap;
		let disabled = (parkingMap.length > 0) ? false : true;

		for(let i = 0; i < entranceCount; i++) {
			entranceOption.push(<option value={i}>{i + 1}</option>);
		}

		return (
			<div id="add-car-container">
				<div className="form">
			    	<label htmlFor="plate">Plate Number:</label>
			    	<input disabled={disabled} type="text" className="plate" />
		    		<label htmlFor="size">Car Size:</label>
		    		<select disabled={disabled} className="size" defaultValue="1">
		    			<option value="1">Small</option>
		    			<option value="2">Medium</option>
		    			<option value="3">Large</option>
		    		</select>
		    		<label htmlFor="entrance">Entrance:</label>
		    		<select disabled={disabled} className="entrance" defaultValue={0}>
		    			{entranceOption}
		    		</select>
			    	<input disabled={disabled} type="button" className="form-btn" value="Park Car" onClick={()=>{this.addCarValidation(document.querySelector('#add-car-container .size').value, document.querySelector('#add-car-container .plate').value, document.querySelector('#add-car-container .entrance').value) }} />
				</div>
			</div>
		)
	}
}

class CarEntry extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};

	  this.unparkCarHandler = this.unparkCarHandler.bind(this);
	}

	unparkCarHandler() {
		let car = this.props.car;
		let parkingMap = this.props.parkingMap;
		let currentTime = new Date();
		car.exitTime = currentTime;
		let slotSize = this.props.slotSize;
		let slotId = this.props.slotId;
		let testTime = new Date();
		testTime.setHours(7);
		testTime.setDate(26)
		let timeDifference = Math.ceil(Math.abs(currentTime - car.entryTime) / 36e5);
		let excessFlatHours = 0;
		if(timeDifference > 24) { 
			excessFlatHours = timeDifference - 24;
		} else if(timeDifference > 3) {
			excessFlatHours = timeDifference - 3;
		} else {
			excessFlatHours = 0;
		}
		let rate = 0;
		switch(parseInt(slotSize)) {
			case 1: rate = 20; break;
			case 2: rate = 60; break;
			case 3: rate = 100; break;
		}
		let amountDue = (timeDifference > 24) ? 5000 + (rate * excessFlatHours) : 40 + (rate * excessFlatHours);
		alert('Parking receipt for ' + car.plate + ':\nDuration (rounded up): ' + timeDifference + '\nAmount Due: PHP ' + amountDue);

		this.props.updateSlot(slotId, undefined, undefined, null);
	}

	render() {
		let slotSizeText;
		let car = this.props.car;
		let entryTimeText = car.entryTime.getMonth() + '/' + car.entryTime.getDate() + '/' + car.entryTime.getFullYear() + ', ' + car.entryTime.getHours() + ':' + car.entryTime.getMinutes();
	
		switch(parseInt(this.props.slotSize)) {
			case 1: slotSizeText = 'Small'; break;
			case 2: slotSizeText = 'Medium'; break;
			case 3: slotSizeText = 'Large'; break;
		}
	
		return (
			<div id={'car-entry-' + this.props.slotId } className="car-entry">
				<p className="description bold">Plate No. {car.plate}</p>
				<p className="description">Slot No. {this.props.slotId + 1}</p>
				<p className="description">Slot Size: {slotSizeText}</p>
				<p className="description">Parked: {entryTimeText}</p>
				<input type="button" value="Unpark Car" onClick={this.unparkCarHandler} />
			</div>
		)
	}
}

class CarList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		let parkingMap = this.props.parkingMap;
		let carHistory = this.props.carHistory;
		let entryList = [];
		let car;
		parkingMap.forEach((element, index) => {
			if(element.occupied !== null) {
				for(let i = 0; i < carHistory.length; i++) {
					if(carHistory[i].plate === element.occupied) {
						car = carHistory[i];
						break;
					}
				}
				entryList.push(<CarEntry key={index} car={car} parkingMap={parkingMap} slotNumber={index} slotId={element.id} slotSize={element.size} updateSlot={this.props.updateSlot} />);
			}
		});
		return (
			<div id="car-entry-list">
				{entryList}
			</div>
		);
	}
}

class CarManager extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		return (
			<div id="car-management-container">
				<AddCarForm carHistory={this.props.carHistory} entranceCount={this.props.entranceCount} parkingMap={this.props.parkingMap} addCar={this.props.addCar} />
				<p className="parked-car-header">Parked Cars</p>
				<CarList parkingMap={this.props.parkingMap} carHistory={this.props.carHistory} updateSlot={this.props.updateSlot} />
			</div>
        );
	}
}

export default CarManager;