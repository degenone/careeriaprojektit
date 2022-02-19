import React, { Component } from 'react';
import './Viestit.css';
import Helpit from './Helpit';

class Viesti extends Component {
    render() {
        return (
            <p>Tässä on oma vakioviesti.</p>
        )
    }
}


class ViestiPrp extends Component {
    render() {
        // if (this.props.pvm) {
        //     console.log(this.props.pvm);
        // }
        return (
            <>
                <p>{this.props.viesti} - <small>{this.props.käyttäjä}</small></p>
            </>
        )
    }
}


class Viestit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showHelp: "hide"
        };
    }

    handleClickHelp = (event) => {
        this.setState({
            showHelp: (this.state.showHelp === "show") ? "hide" : "show" 
        })
    }

    render() {
        if (this.state.showHelp === "show") {
            return(
                <div className="Viestit">
                    <header className="Viestit-header">
                        <h3>Viestit-sovellusikkuna</h3>
                    </header>
                    <Helpit moduuli="viestit" />
                    <div>
                        <button className='myButton' onClick={this.handleClickHelp}>Piilota opaste</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="Viestit">
                    <header className="Viestit-header">
                        <h3>Viestit-sovellusikkuna</h3>
                    </header>
                    <br />
                    <em>Tässä luetellaan viestejä</em>
                    <Viesti />
                    <ViestiPrp viesti="Viesti #1" käyttäjä="Tero" pvm={new Date().toLocaleDateString()} />
                    <ViestiPrp viesti="Terve Tero!" käyttäjä="Vierailija"/>
                    <ViestiPrp viesti="No terveppä terve. Kukas siellä?" käyttäjä="Tero"/>
                    <br />
                    <div>
                        <button className='myButton' onClick={this.handleClickHelp}>Näytä opaste</button>
                    </div>
                </div>
            );
        }
    }
}

export default Viestit;
