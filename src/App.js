import React, { Component } from 'react';
import CarManager from './components/CarManager';
import ParkingMap from './components/ParkingMap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	nextId: 0,
        	entranceCount: 3,
        	parkingMap: [],
        	carHistory: []
        };

        this.addEntrance = this.addEntrance.bind(this);
        this.removeEntrance = this.removeEntrance.bind(this);
        this.addSlot = this.addSlot.bind(this);
        this.updateSlot = this.updateSlot.bind(this);
        this.deleteSlot = this.deleteSlot.bind(this);
        this.addCar = this.addCar.bind(this);
    }

    addEntrance() {
    	let newState = {entranceCount: this.state.entranceCount + 1};
    	let slotCount = this.state.parkingMap.length;

    	if(slotCount > 0) {
    		let updatedParkingMap = this.state.parkingMap;
    		for(let i = 0; i < slotCount; i++) {
    			updatedParkingMap[i].distanceArray.push(1);
    		}
    		newState.parkingMap = updatedParkingMap;
    	}
    	this.setState(newState);
    }

    removeEntrance() {
    	let entranceCount = this.state.entranceCount;
    	if(entranceCount > 3) {
    		let newState = {entranceCount: entranceCount - 1};
	    	let slotCount = this.state.parkingMap.length;

	    	if(slotCount > 0) {
	    		let updatedParkingMap = this.state.parkingMap;
	    		for(let i = 0; i < slotCount; i++) {
	    			updatedParkingMap[i].distanceArray.pop();
	    		}
	    		newState.parkingMap = updatedParkingMap;
	    	}
	    	this.setState(newState);
    	}
    }

    addSlot(entry) {
    	this.setState({parkingMap: [...this.state.parkingMap, entry]});
   		this.setState({nextId: this.state.nextId + 1});
    }

    deleteSlot(id) {
    	let parkingMap = this.state.parkingMap;
    	for(let i = 0; i < parkingMap.length; i++) {
    		if(parkingMap[i].id === id) {
    			parkingMap.splice(i, 1);
    			break;
    		}
    	}

    	this.setState({parkingMap: parkingMap});
    }

    updateSlot(id, size, distanceArray, occupied) {
    	let parkingMap = this.state.parkingMap;
    	size = (size) ? size : parkingMap[id].size;
    	distanceArray = (distanceArray) ? distanceArray : parkingMap[id].distanceArray;
    	occupied = (occupied || occupied === null) ? occupied : parkingMap[id].occupied;

    	for(let i = 0; i < parkingMap.length; i++) {
    		if(parkingMap[i].id === id) {
    			parkingMap[i].size = size;
    			parkingMap[i].distanceArray = distanceArray;
    			parkingMap[i].occupied = occupied;
    			break;
    		}
    	}

    	this.setState({parkingMap: parkingMap}, () => {console.log(this.state.parkingMap)});
    }

    addCar(car) {
    	let parkingMap = this.state.parkingMap;
    	let carHistory = this.state.carHistory;
    	let chosenIndex;
    	let chosenDistance;
    	let chosenId;
    	let currentTime = new Date();
    	let timeDifference = 0;
    	for(let i = 0; i < parkingMap.length; i++) {
    		let currentEntryPoint = parkingMap[i].distanceArray[car.entryPoint];
    		if((currentEntryPoint < chosenDistance || !chosenDistance) && parkingMap[i].size >= car.size && parkingMap[i].occupied === null) {
    			chosenDistance = currentEntryPoint;
    			chosenIndex = i;
    			chosenId = parkingMap[i].id
    		}
    	}

    	parkingMap[chosenIndex].occupied = car.plate;
    	car.slotId = chosenId;

    	for(let j = 0; j < carHistory.length; j++) {
    		if(carHistory[j].plate === car.plate) {
				timeDifference = Math.ceil(Math.abs(currentTime - carHistory[j].exitTime) / 36e5);
				if(timeDifference <= 1) {
					car.entryTime = carHistory[j].entryTime;
				} else {
					car.entryTime = currentTime;
				}
    			carHistory.splice(j, 1);
    			break;
    		}
    	}

    	this.setState({parkingMap: parkingMap, carHistory: [...this.state.carHistory, car]}, ()=>{console.log(this.state.parkingMap); console.log(this.state.carHistory);});
    }

    render() {
        return (
            <Router>
	            <div id="app-container">
	            	<Route path ="/parkingmap" render={props => <ParkingMap nextId={this.state.nextId} entranceCount={this.state.entranceCount} parkingMap={this.state.parkingMap} addSlot={this.addSlot} updateSlot={this.updateSlot} deleteSlot={this.deleteSlot} addEntrance={this.addEntrance} removeEntrance={this.removeEntrance} />} />
	        		<nav id="navbar">
	        			<ul>
	        				<li>
	        					<Link to="/parkingmap">Parking Map</Link>
	        				</li>
	        			</ul>
	        		</nav>
	            	<CarManager carHistory={this.state.carHistory} entranceCount={this.state.entranceCount} parkingMap={this.state.parkingMap} addCar={this.addCar} updateSlot={this.updateSlot} />
	            </div>
            </Router>
        );
    }
}

export default App;