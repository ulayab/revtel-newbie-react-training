import React, { Component } from 'react'
import { getAppData } from './AppLogic';

export default class AppContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			parkList: [],
			isFetching: true,
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
		let {isFetching, parkList} = this.state;
		const renderParkItem = (parkData, key) => <div key={key}>{parkData.ParkName}</div>

		return (
			<div>
				{
					isFetching
						? 'now is fetching'
						: parkList.map(renderParkItem)
				}
			</div>
		)
	}
}