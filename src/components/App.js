import React from 'react';
import CurrentColor from './CurrentColor';
import SimilarColors from './SimilarColors';
import './App.css';
import axios from 'axios';
import SearchBar from './SearchBar';

class App extends React.Component {
    state = {
        currentColor: {
            name: 'Turquoise',
            hex: '#03676f',
            brand: 'Vallejo',
            productline: 'Game Color',
        },
        similarColors: [
            {
                name: 'Sotek Green',
                hex: '#0c6a74',
                brand: 'Citadel',
                productline: 'Layer & Edge',
            },
            {
                name: 'HD Winter Blue',
                hex: '#1d6d74',
                brand: 'Reaper',
                productline: 'HD',
            },
            {
                name: 'Marine Teal',
                hex: '#005f6d',
                brand: 'Reaper',
                productline: 'MSP',
            },
            {
                name: 'Coal Black',
                hex: '#015960',
                brand: 'Formula P3',
                productline: '',
            },
            {
                name: 'Field Blue',
                hex: '#436872',
                brand: 'Vallejo',
                productline: 'Model Color',
            },
            {
                name: 'Incubi Darkness',
                hex: '#0b4849',
                brand: 'Citadel',
                productline: 'Base',
            },
        ],
        colors: [],
    };

    async componentDidMount() {
        // Load JSON color data
        axios
            .get('./colors.json')
            .then((response) => {
                this.setState({
                    colors: response.data,
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    onSearchSubmit = (color) => {
        this.setState({
            currentColor: {
                name: color.name,
                hex: color.hex,
                brand: color.brand,
                productline: color.productline,
            },
        });
        //console.log(term);
    };

    render() {
        let search;
        if (this.state.colors.length > 0) {
            search = <SearchBar onSubmit={this.onSearchSubmit} colors={this.state.colors} />;
        } else {
            search = <SearchBar onSubmit={this.onSearchSubmit} colors={[]} />;
        }

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* <SearchBar onSubmit={this.onSearchSubmit} /> */}
                {search}
                <div className="ui equal width center aligned padded grid" style={{ flexGrow: '1' }}>
                    <CurrentColor color={this.state.currentColor} />
                    <SimilarColors currentColor={this.state.currentColor} similarColors={this.state.similarColors} />
                </div>
            </div>
        );
    }
}

export default App;
