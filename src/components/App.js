import React from 'react';
import CurrentColor from './CurrentColor';
import SimilarColors from './SimilarColors';
import './App.css';
import axios from 'axios';
import SearchBar from './SearchBar';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

class App extends React.Component {
    state = { currentColor: null, similarColors: null, colors: null };

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

    renderHeader() {
        let search;
        if (this.state.colors !== null) {
            search = <SearchBar onSubmit={this.onSearchSubmit} colors={this.state.colors} />;
        } else {
            search = <SearchBar onSubmit={this.onSearchSubmit} colors={[]} />;
        }
        return <header>{search}</header>;
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
