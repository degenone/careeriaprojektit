import React, {Component} from 'react';

export default class TypicodeFetch extends Component {
    constructor(props) {
        super(props);
        // console.log('TypicodeFetch constructor.');
        this.state = {
            todos: [],
            recordcount: 0,
            page: 1,
            limit: 10,
            userId: ""
        };
        this.handleChangeUserId = this.handleChangeUserId.bind(this);
    }
    
    componentDidMount() {
        // console.log('TypicodeFetch componentDidMount.');
        this.HeaTypicodesta();
    }

    handleClickPrev = (event) => {
        if (this.state.page > 1) {
            this.setState({ page: this.state.page - 1 }, this.HeaTypicodesta);
        }
        // console.log(`TypicodeFetch handleClickPrev (${this.state.page}, ${this.state.limit})`);
    }

    handleClickNext = (event) => {
        if (this.state.recordcount > 0) {
            this.setState({ page: this.state.page + 1 }, this.HeaTypicodesta);
        }
        // console.log(`TypicodeFetch handleClickNext (${this.state.page}, ${this.state.limit})`);
    }

    handleChangeUserId = (event) => {
        this.setState({userId: event.target.value}, this.HeaTypicodesta);
    };

    HeaTypicodesta() {
        let uri = 'https://jsonplaceholder.typicode.com/todos';
        if (this.state.userId && this.state.userId.trim()) {
            uri += `?userId=${this.state.userId}&_page=${this.state.page}&_limit=${this.state.limit}`;
        } else {
            uri += `?_page=${this.state.page}&_limit=${this.state.limit}`;
        }
        // console.log(`HaeTypicodesta ${uri}`);
        fetch(uri)
            .then(response => response.json())
            .then(json => {
                // console.log(JSON.stringify(json));
                this.setState({todos: json, recordcount: json.length});
            });
    }
    
    render() {
        // console.log('TypicodeFetch render.');
        let viestit = <h3>Rivejä {this.state.recordcount}.</h3>;
        let taulukko = [];
        if (this.state.recordcount > 0) {
            this.state.todos.forEach(element => {
                taulukko.push(
                    <tr key={element.id}>
                        <td>{element.id}</td>
                        <td>{element.userId}</td>
                        <td>{element.title}</td>
                        <td><input type="checkbox" disabled checked={element.completed} /></td>
                    </tr>
                );
            })
        } else {
            viestit = <h3 className='loading'>Ladataan tietoja Typicoden API:sta</h3>;
        }

        return(
            <div style={{padding: '0% 1vw'}}>
                {viestit}
                <hr />
                <input type="number" min='1' placeholder="Anna käyttäjän ID" title="Hae tehtäviä käyttäjän ID:n perusteella" onChange={this.handleChangeUserId} />
                <button className='myButton' onClick={this.handleClickPrev}>Edelliset</button>
                <button className='myButton' onClick={this.handleClickNext}>Seuraavat</button>
                <table id='t01'><thead><tr><th>TEHTÄVÄ ID</th><th>KÄYTTÄJÄN ID</th><th>OTSIKKO</th><th>VALMIS</th></tr></thead><tbody>{taulukko}</tbody></table>
            </div>
        );
    }
}