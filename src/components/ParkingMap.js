import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./../styles/ParkingMap.css";

class ParkingSlot {
	constructor(id, size, distanceArray, occupied) {
		this.id = id;
		this.size = size;
		this.distanceArray = distanceArray;
		this.occupied = occupied;
	}
}

class SlotForm extends Component {
	constructor(props) {
		super(props);
	
		this.state = {};

		this.updateSlotValidation = this.updateSlotValidation.bind(this);
	}

	updateSlotValidation(id, size, distanceFields) {
		let distanceArray = [];

		distanceFields.forEach((element) => {
			distanceArray.push(element.value);
		});

		this.props.updateSlot(id, size, distanceArray);
	}

	render() {
		let distanceEntry = [], deleteBtn = '', distanceArray = [];
		const entryObj = this.props.entryObj;

		for(let i = 0; i < this.props.entranceCount; i++) {
			distanceEntry.push((
			    <div key={i} className="distance-entry">
					<label htmlFor={'distance-' + i}>Entrance {i + 1}: </label>
					<input type="number" className="distance-input" defaultValue={(entryObj.distanceArray.length > 0) ? entryObj.distanceArray[i] : 1} />
				</div>
			));
		}

		return (
		    <div key={entryObj.id} id={'slot-' + entryObj.id} className="slot-item">
		    	<input type="button" value="x" class="delete-slot-btn" onClick={() => {this.props.deleteSlot(entryObj.id)}} />
		    	<div className="size-container">
		    		<label htmlFor="size">Parking Slot Size: </label>
		    		<select className="size" defaultValue={(entryObj.size) ? entryObj.size : '1'}>
		    			<option value="1">Small</option>
		    			<option value="2">Medium</option>
		    			<option value="3">Large</option>
		    		</select>
		    	</div>
		    	<div className="distance-container">
		    		<label htmlFor="entries-container">Distance from</label>
		    		<div id="entries-container">
		    			{distanceEntry}
		    		</div>
		    	</div>
		    	<input type="button" className="form-btn" value="Save" onClick={() => {this.updateSlotValidation(entryObj.id, document.querySelector('#slot-' + entryObj.id + ' .size').value, document.querySelectorAll('#slot-' + entryObj.id + ' .distance-input')) }} />
		    </div>
		);
	}
}

class ParkingMap extends Component {
	constructor(props) {
		super(props);

		this.addSlotHandler = this.addSlotHandler.bind(this);
	}

	addSlotHandler() {
		let nextId = this.props.nextId;
    	let distanceArray = [];
    	for(let i = 0; i < this.props.entranceCount; i++) {
    		distanceArray.push(1);
    	}

		this.props.addSlot(new ParkingSlot(nextId, 1, distanceArray, null));
	}

	render() {
		let activeSection;
		let slotEntry = [];
		let entranceCount = this.props.entranceCount;

		this.props.parkingMap.forEach((element, index) => {
			slotEntry.push(<SlotForm key={index} entryObj={element} entranceCount={entranceCount} updateSlot={this.props.updateSlot} deleteSlot={this.props.deleteSlot} />)
		});

		return (
			<div className="modal-container">
				<div id="map-modal" className="modal">
					<div className="form">
				    	<Link className="form-close" to="/">x</Link>
						<p id="entrance-count">Current number of entrances: {entranceCount}</p>
						<div id="count-control-container"><input type="button" id="add-entrance-btn" value="+" onClick={this.props.addEntrance} />
							<input type="button" id="remove-entrance-btn" value="-" onClick={this.props.removeEntrance} disabled={(entranceCount <= 3) ? true : false} /></div>
						<div id="parking-slot-container">
							<div id="slots">
								{slotEntry}
							</div>
							<div id="add-entry-container">
								<input type="button" value="+" onClick={() => {this.addSlotHandler()}} />
							</div>
						</div>
				    </div>
				</div>
			</div>
        );
	}
}

export default ParkingMap;