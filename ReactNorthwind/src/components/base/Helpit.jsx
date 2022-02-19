import React, {Component} from 'react';

export default class Helpit extends Component {
    render() {
        if (this.props.moduuli === "viestit") {
            return(
                <div>
                    <p>Viestit osiossa voit jättää viestejä muille sivun käyttäjille.</p>
                </div>
            );
        } else if (this.props.moduuli === "NWCustomersFetch") {
            return(
                <div>
                    <p>Voit hakea asiakkaita ja lisätä tai muokata niiden tietoja.</p>
                </div>
            );
        } else if (this.props.moduuli === "analogi") {
            return(
                <div>
                    <p>Analogisessa kellossa on tunti-, minuuttu ja sekuntti käsi.</p>
                </div>
            );
        } else if (this.props.moduuli === "NWProductsFetch") {
            return(
                <div>
                    <p>Voit hakea tuotteita ja lisätä tai muokata niiden tietoja.</p>
                </div>
            );
        } else {
            return(
                <div>
                    <p>Tämä on opaste osio.</p>
                </div>
            );
        }
    }
}