import React, { Component } from 'react'
import { getAppData } from './AppLogic';

export default class AppContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			parkList: [],
			isFetching: true,

			filterInput: ''
		}

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
		getAppData()
			.then(data => {
				this.setState({
					isFetching: false,
					parkList: data.result.results,
				})
			})

	}

	render() {
		let {isFetching, parkList} = this.state;

		const parkListItems = parkList.map(generateParkItem)

		return (
			<div>
				<input style={styles.inputStyle}
					   type='text'
					   placeholder='請輸入欲查詢公園 (如：二二八和平公園)'
					   value={this.state.filterInput}
					   onChange={this.handleInputChange}
				/>

				{
					isFetching
						? 'now is fetching'
						: <div style={styles.containerStyle}>{parkListItems}</div>
				}
			</div>
		)
	}

	handleInputChange(evt) {
		console.log('input event:', evt.target.value)
		this.setState({filterInput: evt.target.value})
	}
}

const generateParkItem = (parkData, key) => (
	<div key={key} style={styles.parkItemStyle}>
		{parkData.ParkName + ' : ' + parkData.Name}
	</div>
)

const styles = {
	parkItemStyle: {
		backgroundColor: 'lightgrey',
		width: '50%',
		padding: 20,
		marginTop: 20,
		borderRadius: 20,
	},
	containerStyle: {
		display:'flex',
		flexDirection:'column',
		alignItems:'center',
	},
	inputStyle: {
		width:'45%',
		hight:80,
		marginTop:30,
	}
}