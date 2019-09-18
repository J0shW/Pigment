import React from 'react';
import CurrentColor from './CurrentColor';
import SimilarColors from './SimilarColors';
import './App.css';
import axios from 'axios';
import SearchBar from './SearchBar';
import _ from 'lodash';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';

const InitialState = {
    currentColor: null,
    similarColors: null,
    colors: [],
};

class App extends React.Component {
    //state = { currentColor: null, similarColors: null, colors: null };
    // Retrieve the last state
    state = localStorage.getItem('appState') ? JSON.parse(localStorage.getItem('appState')) : InitialState;

    async componentDidMount() {
        // Load JSON color data
        axios
            .get('./colorsMatched.json')
            .then((response) => {
                this.setState({ colors: response.data }, () => {
                    this.setRandomColor();
                    localStorage.setItem('appState', JSON.stringify(this.state));
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    componentWillUnmount() {
        // Remember state for the next mount
        localStorage.setItem('appState', JSON.stringify(this.state));
    }

    onSearchSubmit = (color) => {
        this.setState(
            {
                currentColor: color,
                similarColors: this.getSimilarColors(color),
            },
            () => {
                localStorage.setItem('appState', JSON.stringify(this.state));
            }
        );
    };

    getSimilarColors(currentColor) {
        if (currentColor.matches) {
            let similarColors = currentColor.matches.map((match) => {
                const found = _.find(this.state.colors, ['id', match.id]);
                if (found) {
                    found.delta = match.deltaE;
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

    setRandomColor = () => {
        const randomColor = this.state.colors[Math.floor(Math.random() * this.state.colors.length)];
        this.setState(
            {
                currentColor: randomColor,
            },
            () => {
                this.setState({ similarColors: this.getSimilarColors(randomColor) });
            }
        );
    };

    renderHeader() {
        return (
            <header>
                <nav>
                    <button onClick={this.setRandomColor}>
                        <Icon name="tint" />
                    </button>
                    <div className="search-wrapper">
                        <SearchBar onSubmit={this.onSearchSubmit} colors={this.state.colors} />;
                    </div>
                    <button>
                        <Icon name="filter" />
                    </button>
                </nav>
            </header>
        );
    }

    renderMain() {
        if (this.state.currentColor !== null && this.state.similarColors !== null) {
            return (
                <main>
                    <CurrentColor color={this.state.currentColor} />
                    <SimilarColors similarColors={this.state.similarColors} />
                </main>
            );
        } else {
            return (
                <main>
                    <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>
                </main>
            );
        }
    }

    renderFooter() {
        return (
            <footer>
                <div>
                    <h4>Best Match</h4>
                </div>
                <div id="footerline"></div>
                <div>
                    <h4>Good Match</h4>
                </div>
            </footer>
        );
    }

    render() {
        return (
            <div className="wrapper">
                {this.renderHeader()}
                {this.renderMain()}
                {this.renderFooter()}
            </div>
        );
    }
}

export default App;
