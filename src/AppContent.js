import React, { Component } from 'react'
import { getAppData } from './AppLogic';

export default class AppContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			parkList: [],
			isFetching: true,

			filterInput: '',
		}
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
		let { isFetching, parkList, filterInput, clickRecord } = this.state;

		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

const ParkItems = ({ isFetching, parkList, filterInput }) => {
	if (isFetching) {
		return <div>Fetching ...</div>
	}

	return parkList
		.filter(({ParkName, Name}) => (ParkName + ':' + Name).indexOf(filterInput) !== -1)
		.map((parkData, idx) => <ParkItem parkData={parkData} key={idx} />);
}

class ParkItem extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isClicked: false,
		}
	}

	render() {
		let { isClicked } = this.state;
		let { parkData } = this.props;

		let myStyle = isClicked ? styles.parkItemLikedStyle : styles.parkItemStyle
		return (
			<div
				style={myStyle}
				onClick={() => {
					this.setState({ isClicked: !isClicked })
				}}
			>
				{parkData.ParkName + ' : ' + parkData.Name}
			</div>
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