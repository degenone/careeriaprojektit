import React, {Component} from 'react';
import Request from 'react-http-request';

export default class Md5Salaus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            inputPW: '',
            submitted: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        this.setState({ 
            submitted: true, 
            inputPW: ''
        });
        e.preventDefault();
    }

    handleChange(e) {
        if (this.state.submitted) {
            this.setState({ 
                submitted: false,
                password: e.target.value,
                inputPW: e.target.value 
            });
        } else {
            this.setState({ 
                password: e.target.value,
                inputPW: e.target.value 
            });
        }
    }

    render() {
        let url = `http://md5.jsontest.com/?text=${this.state.password}`;
        return(
            <div style={{textAlign: 'center'}}>
                <h3>Testaa salasanan salaamista Md5 algoritillä.</h3>
                <form onSubmit={this.handleSubmit} style={{marginTop: '0%'}}>
                    <input type='text' name='password-test' required onChange={this.handleChange} value={this.state.inputPW} placeholder='Anna salasana' />
                    <input className='myButton' type='submit' value='Hae hash' />
                </form>
                {this.state.submitted && 
                <div>
                    <hr />
                    <Request url={url} method="get" accept="application/json" verbose={false}>
                        {
                            ({error, result, loading}) => {
                                if (loading) {
                                    return <><p className='loading'>Ladataan</p></>;
                                } else if (error) {
                                    return <><p>En voinut toteuttaa pyyntöä.</p></>;
                                } else {
                                    return <>Alkuperäinen: "{result.body.original}"<br />Salattu: "{result.body.md5}"</>;
                                }
                            }
                        }
                    </Request>
                    <hr />
                </div>}
            </div>
        );
    }
}

