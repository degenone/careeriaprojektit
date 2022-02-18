import React, { Component } from 'react';
import AnalogWatch from './AnalogWatch';

class Kello extends Component {
    render() {
        return(<h4>Kello on nyt: {this.props.kellonaika}</h4>);
    }
}


class DigitalWatch extends Component {
    constructor(props) {
        super(props);
        // console.log("DigitalWatch constructor.");
        this.state = {
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
        };
    }

    componentDidMount() {
        // console.log("DigitalWatch componentDidMount.");
        this.interwalID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick() {
        // console.log("DigitalWatch tick.");
        this.setState({
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
        });
    }

    componentWillUnmount() {
        // console.log("DigitalWatch componentWillUnmount.");
        clearInterval(this.interwalID);
    }

    render() {
        // console.log("DigitalWatch render.");
        return (
            <div className="Aika">
                <div>
                    <p>Päivämäärä: {this.state.date}</p>
                    <Kello kellonaika={this.state.time} />
                </div>
                <AnalogWatch />
            </div>
        );
    }
}

export default DigitalWatch;
