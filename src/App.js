import React, { Component } from 'react';
import Main from './components/Main';
import ParkingMap from './components/ParkingMap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Car {
	constructor(size, entryTime) {
		this.size = size;
		this.entryTime = entryTime;
	}
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	entranceCount: 0,
        	parkingMap: []
        };

        this.updateEntrance = this.updateEntrance.bind(this);
    }

    updateEntrance(count) {
    	this.setState({entranceCount: count});
    }

    updateParkingMap(entry) {
    	this.setState({parkingMap: [...this.state.parkingMap, entry]});
    }

    render() {
        return (
            <Router>
	            <div id="app-container">
	            	<div id="modal-container">
	            		<Route path ="/parkingmap" render={props => <ParkingMap updateParkingMap={this.updateParkingMap} updateEntrance={this.updateParkingMap} />} />
	            	</div>
	        		<nav id="navbar">
	        			<ul>
	        				<li>
	        					<Link to="/parkingmap">Parking Map</Link>
	        				</li>
	        			</ul>
	        		</nav>
	        		<input type="button" value="asd" onClick={this.showCount} />
	            	<Main></Main>
	            </div>
            </Router>
        );
    }
}

export default App;