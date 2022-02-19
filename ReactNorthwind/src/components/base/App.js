import React, { Component } from 'react';
import logo from '../../logo.svg';
import './App.css';
import DigitalWatch from './DigitalWatch';

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            wobble: 0,
        }
        this.handleWobble = this.handleWobble.bind(this);
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
    }

    handleWobble() {
        this.setState({ wobble: 1 });
        // console.log(`App handleWobble `);
    }

    handleAnimationEnd() {
        // console.log('App handleAnimationEnd.');
        this.setState({ wobble: 0 });
    }

    render() {
        return (
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} className='App-logo' alt='logo' />
                    <p>This is my first React app.</p>
                    <button className='btn-wobbly myButton' onClick={this.handleWobble} onAnimationEnd={this.handleAnimationEnd} wobble={this.state.wobble}>Press me!</button>
                </header>
                <DigitalWatch />
            </div>
        );
    }
}
