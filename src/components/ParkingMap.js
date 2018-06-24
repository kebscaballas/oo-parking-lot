import React, {Component} from 'react';

class ParkingSlot {
	constructor(size, distanceArray, occupied) {
		this.size = size;
		this.distanceArray = distanceArray;
		this.occupied = occupied;
	}
}

const EntranceForm = (props) => (
	<div class="form">
		<input type="number" id="entrance-count" />
		<input type="button" class="form-btn" value="Next" onClick={props.formHandler} />
	</div>
)

const SlotForm = (props) => (
    <div class="form">
    	<input type="number" id="entrance-count" />
    	<input type="button" class="form-btn" value="Next" onClick={props.formHandler} />
    </div>
)

class ParkingMap extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			section: "entrance"
		};

		this.handleEntranceForm = this.handleEntranceForm.bind(this);
	}

	handleEntranceForm() {
		let entranceCount = document.getElementById('entrance-count').value;
		this.props.updateEntrance(entranceCount);
	}

	render() {
		let activeSection;
		if(this.state.section === "entrance") {
			activeSection = <EntranceForm formHandler={this.handleEntranceForm}></EntranceForm>;
		} else {

		}

		return (
			<div id="parking-modal" className="modal">
				<div id="form-container">
					{activeSection}
				</div>
			</div>
        );
	}
}

export default ParkingMap;