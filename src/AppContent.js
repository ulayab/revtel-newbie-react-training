import React, { Component } from 'react'
import { getAppData } from './AppLogic';

export default class AppContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			parkList: [],
			isFetching: true,

			filterInput: '',
			clickRecord: [],
		}
	}

	componentDidMount() {
		getAppData()
			.then(data => {
				this.setState({
					isFetching: false,
					parkList: data.result.results,
					clickRecord: data.result.results.map(() => false),
				})
			})
	}

	render() {
		let { isFetching, parkList, filterInput, clickRecord } = this.state;

		return (
			<div>
				<UserSearch onChange={text => this.setState({ filterInput: text })} />
				<ParkItems isFetching={isFetching}
					parkList={parkList}
					filterInput={filterInput}
					clickRecord={clickRecord}
				/>
			</div>
		)
	}
}

class UserSearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userInput: '',
		}

		this.handleInputChange = this.handleInputChange.bind(this)
	}

	render() {
		let { userInput } = this.state;

		return (
			<input style={styles.inputStyle}
				type='text'
				placeholder={'請輸入欲查詢公園 (如：二二八和平公園)'}
				value={userInput}
				onChange={this.handleInputChange}
			/>
		)
	}

	handleInputChange(evt) {
		this.setState({ userInput: evt.target.value });

		if (this.props.onChange) {
			this.props.onChange(evt.target.value)
		}
	}
}

class ParkItems extends Component {
	render() {
		let { isFetching } = this.props;

		return isFetching ? this._renderFetching() : this._renderItems();
	}

	_renderFetching() {
		return (
			<div>Fetching ...</div>
		)
	}

	_renderItems() {
		let { parkList, filterInput, clickRecord } = this.props;

		const generateParkItem = (parkData, idx) => {
			let myStyle = clickRecord[idx] ? styles.parkItemLikedStyle : styles.parkItemStyle
			return (
				<div
					key={idx}
					style={myStyle}
					onClick={() => {
						let newArray = [...clickRecord];
						newArray[idx] = !clickRecord[idx]
						this.setState({ clickRecord: newArray })
					}}
				>
					{parkData.ParkName + ' : ' + parkData.Name}
				</div>
			)
		}
		const filteredItems = parkList.filter((ele) => {
			return (ele.ParkName + ':' + ele.Name).indexOf(filterInput) !== -1
		});
		const parkListItems = filteredItems.map(generateParkItem)

		return (
			<div style={styles.containerStyle}>{parkListItems}</div>
		)
	}
}


const styles = {
	parkItemStyle: {
		backgroundColor: 'lightgrey',
		width: '50%',
		padding: 20,
		marginTop: 20,
		borderRadius: 20,
	},
	parkItemLikedStyle: {
		backgroundColor: '#FCF3CF',
		width: '50%',
		padding: 20,
		marginTop: 20,
		borderRadius: 20,
	},

	containerStyle: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	inputStyle: {
		width: '45%',
		hight: 80,
		marginTop: 30,
	}
}