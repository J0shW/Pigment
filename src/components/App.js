import React from 'react';
import CurrentColor from './CurrentColor';
import SimilarColors from './SimilarColors';
import './App.css';
import axios from 'axios';
import SearchBar from './SearchBar';
import _ from 'lodash';

class App extends React.Component {
    state = {
        currentColor: {
            name: 'Turquoise',
            hex: '#03676f',
            brand: 'Vallejo',
            productline: 'Game Color',
            matches: [],
        },
        similarColors: [
            {
                name: 'Sotek Green',
                hex: '#0c6a74',
                brand: 'Citadel',
                productline: 'Layer & Edge',
            },
        ],
        colors: [],
    };

    async componentDidMount() {
        // Load JSON color data
        axios
            .get('./colorsMatched.json')
            .then((response) => {
                const randomColor = response.data[Math.floor(Math.random() * response.data.length)];
                this.setState(
                    {
                        colors: response.data,
                        currentColor: randomColor,
                    },
                    () => {
                        this.setState({ similarColors: this.getSimilarColors(randomColor) });
                    }
                );
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    onSearchSubmit = (color) => {
        this.setState({
            currentColor: color,
            similarColors: this.getSimilarColors(color),
        });
    };

    getSimilarColors(currentColor) {
        if (currentColor.matches) {
            let similarColors = currentColor.matches.map((match) => {
                const found = _.find(this.state.colors, ['id', match.id]);
                if (found) {
                    found.deltaE = match.deltaE;
                    return found;
                } else {
                    return null;
                }
            });
            return similarColors.slice(0, 5);
        } else {
            return null;
        }
    }

    render() {
        let search;
        if (this.state.colors.length > 0) {
            search = <SearchBar onSubmit={this.onSearchSubmit} colors={this.state.colors} />;
        } else {
            search = <SearchBar onSubmit={this.onSearchSubmit} colors={[]} />;
        }

        let similarColors;
        if (this.state.similarColors) {
            similarColors = <SimilarColors similarColors={this.state.similarColors} />;
        }

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {search}
                <div className="ui equal width center aligned padded grid" style={{ flexGrow: '1' }}>
                    <CurrentColor color={this.state.currentColor} />
                    {similarColors}
                </div>
                <div id="myfooter">
                    <div>Best Match</div>
                    <div id="footerline"></div>
                    <div>Good Match</div>
                </div>
            </div>
        );
    }
}

export default App;
