import React, { Component } from 'react'
import { getAppData } from './AppLogic';
import './index.css';

export default class AppContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			parkList: [],
			isFetching: true,
			//filterInputs: '',
			filterInputs: ['', '', ''],
			// filterInput1: '',
			// filterInput2: '',
			// filterInput3: '',
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
		let { isFetching, parkList, filterInputs, clickRecord } = this.state;

		return (
			
			<div class="flex">
			<div>
				<h2>台北市公園搜尋系統</h2>
				<UserSearch onChange={(text) => this.setState({ filterInputs : text})} />
				<ParkItems 
					isFetching={isFetching}
					parkList={parkList}
					filterInputs={filterInputs}
					clickRecord={clickRecord}
				/>
				
			</div>
			</div>
		)
	}
}

class UserSearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userInput1: '',
            userInput2: '',
            userInput3: '',
		}

		this.handleInputChange1 = this.handleInputChange1.bind(this)
		this.handleInputChange2 = this.handleInputChange2.bind(this)
		this.handleInputChange3 = this.handleInputChange3.bind(this)
	}
	
	render() {
		let { userInput1,userInput2,userInput3} = this.state;
	
		return (
			<div>
			<input style={styles.inputStyle}
				type='text'
				placeholder={'請輸入欲查詢公園 (如：二二八和平公園)'}
				value={userInput1}
				onChange={this.handleInputChange1}
			/>
			<input style={styles.inputStyle}
				type='text'
				placeholder={'請輸入欲查詢之內容'}
				value={userInput2}
				onChange={this.handleInputChange2}
			/>
			<input style={styles.inputStyle}
				type='text'
				placeholder={'請輸入欲查詢之最早建造年份'}
				value={userInput3}
				onChange={this.handleInputChange3}
			/>
			</div>
		)
	}

	handleInputChange1(evt) {
		this.setState({ userInputs: evt.target.value });

		if (this.props.onChange) {
			this.props.onChange(evt.target.value, this.state.userInputs, this.state.userInputs)//自動排進33行的text1,text2
		}
	}
	handleInputChange2(evt2) {
		this.setState({ userInputs: evt2.target.value});

		if (this.props.onChange) {
			this.props.onChange(this.state.userInputs, evt2.target.value, this.state.userInputs)
		}
	}
	handleInputChange3(evt3) {
		this.setState({ userInputs: evt3.target.value});

		if (this.props.onChange) {
			this.props.onChange(this.state.userInputs, this.state.userInputs, evt3.target.value)
		}
	}
	
}

const ParkItems = ({ isFetching, parkList, filterInputs}) => {
	if (isFetching) {
		return <div>Fetching ...</div>
	}
	// const hasSubString = (src,sub) => src.indexOf(sub) !== -1;
	// [f1, f2]= filterInputs;

	function filterLogic(parkList, filterInputs) {

		let ret = []

		function f1( list, text){ //第一個filter function(Name,ParkName)
			let r = []
			for(let i=0; i<list.length;i++){
				if(list[i].Name.indexOf(text)!==-1 || list[i].ParkName.indexOf(text)!==-1){
					r.push(list[i])
				}
			}
			return r
		}
		function f2( list, text){ //第二個filter function(introduction)
			let r = []
			for(let i=0; i<list.length;i++){
				if(list[i].Introduction.indexOf(text)!==-1){
					r.push(list[i])
				}
			}
			return r
		}
		function f3( list, text){
			let r = []
			if(text===''){
				return list
			}
			for(let i=0; i<list.length;i++){
				if(funcYearBuilt(list[i],text)){
					r.push(list[i])
				}
			}
			return r
		}
//------------------------------------------------------------------------------//
		function funcYearBuilt( inputY, _yearBuilt){
			let t = inputY.YearBuilt,
			yearBuilt = parseInt(_yearBuilt)

			// tranlate api park data YearBuilt to normal number (year)
			function translateAPIDateToNumber(text) {
				//console.log(`... '${text}', ${yearBuilt}`)

				// TODO
				if (text === '') {
					return -1
				} else {
					return parseInt(text.split('-')[0])
				}

			}

			let y = translateAPIDateToNumber(t)

			// compare(park data YearBuilt to normal number, yearBuilt)
			return y > yearBuilt

		}
//------------------------------------------------------------------------------//
		let ret1 = f1(parkList, filterInputs[0]);
		let ret2 = f2(ret1, filterInputs[1]);
		ret= f3(ret2, filterInputs[2])
		return ret

	}
	let listp = filterLogic(parkList, filterInputs)
	let parkItems = listp.map((parkData, idx) => <ParkItem parkData={parkData} key={idx} />)

	return (
        <div>
        {parkItems}
        </div>
    );
	// return parkList

	
	// 	.filter(({ParkName, Name}) => (((ParkName).indexOf(filterInputs) !== -1)||(Name).indexOf(filterInputs) !== -1))
	// 	.filter(({Introduction}) => (Introduction).indexOf(filterInputs) !== -1)
	// 	.filter(({YearBuilt}) => (((YearBuilt).indexOf(filterInputs) !== -1)||(filterInputs)<=(YearBuilt)))
	// 	.map((parkData, idx) => <ParkItem parkData={parkData} key={idx} />);
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
			
			
			<div class="item" 
				style={myStyle}
				onClick={() => {
					this.setState({ isClicked: !isClicked })
				}}
			>
			<div>
				<h4>{parkData.ParkName + ' : ' + parkData.Name}</h4>
				<h4>{'建造年份 :' +parkData.YearBuilt}</h4>
				<h4>{parkData.Introduction}</h4>
			</div>
				
			</div>
			
		
		)
	}
	
}

const styles = {
	parkItemStyle: {
		backgroundColor: 'darkgrey',
		width: '30%',
		padding: 20,
		marginTop: 20,
		borderRadius: 20,
	},
	parkItemLikedStyle: {
		backgroundColor: '#009393',
		width: '30%',
		padding: 20,
		marginTop: 20,
		borderRadius: 20,
		},

//	containerStyle: {
//		display: 'flex',
//		flexDirection: 'column',
//		alignItems: 'center',
//	},
	inputStyle: {
		width: '30%',
		hight: 80,
		marginTop: 30,
		marginLeft: 15,
		marginRight: 15,

	},

}