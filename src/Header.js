import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

export default class Header extends Component {
	render() {
		return (
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<h1 className='App-title'>Welcome to React</h1>
			</header>
		)
	}
}