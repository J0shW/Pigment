import React from 'react';
import CurrentColor from './CurrentColor';
import SimilarColors from './SimilarColors';
import './App.css';
import axios from 'axios';
import SearchBar from './SearchBar';
import _ from 'lodash';
import { Dimmer, Loader, Icon, Dropdown } from 'semantic-ui-react';
import ReactGA from 'react-ga';
import calcDeltas from '../calcDeltas';

const InitialState = {
    currentColor: null,
    similarColors: null,
    colors: [],
    filters: [],
};

const colorDataVersion = 1;
const calcDelta = new calcDeltas(false);

class App extends React.Component {
    // Retrieve the last state from localStorage
    state = localStorage.getItem(`appState${colorDataVersion}`)
        ? JSON.parse(localStorage.getItem(`appState${colorDataVersion}`))
        : InitialState;

    async componentDidMount() {
        ReactGA.initialize('UA-149514108-1');
        ReactGA.pageview('/homepage');

        if (this.state.colors.length === 0) {
            // Load JSON color data

            ReactGA.event({
                category: 'Load Colors',
                action: `Load Colors Version ${colorDataVersion}`,
            });

            axios
                .get('./colorsMatched.json')
                .then((response) => {
                    this.setState({ colors: response.data }, () => {
                        this.getFilters();
                        this.setRandomColor();
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }

    componentDidUpdate() {
        // Remember state for the next mount
        localStorage.clear();
        localStorage.setItem(`appState${colorDataVersion}`, JSON.stringify(this.state));
    }

    onSearchSubmit = (color) => {
        ReactGA.event({
            category: 'Search',
            action: 'Search Submit',
        });

        this.setState({
            currentColor: color,
            similarColors: this.getSimilarColors(color),
        });
    };

    dimmerOpen = () => {
        var x = document.getElementById('snackbar');
        x.className = 'show';
        setTimeout(function() {
            x.className = x.className.replace('show', '');
        }, 3000);
    };

    getFilters() {
        let productlines = _.uniqBy(this.state.colors, 'productline');
        productlines = productlines.map((line) => {
            return { productline: `${line.brand} ${line.productline}`, active: true };
        });
        this.setState({ filters: productlines });
    }

    getSimilarColors(currentColor) {
        if (currentColor.matches) {
            const activeFilters = [];
            _.forEach(this.state.filters, (filter) => {
                if (filter.active) {
                    activeFilters.push(filter.productline);
                }
            });
            let similarColors = [];

            _.forEach(currentColor.matches, (match) => {
                const found = _.find(this.state.colors, (color) => {
                    return color.id === match.id && _.includes(activeFilters, `${color.brand} ${color.productline}`);
                });

                if (found) {
                    found.delta = match.deltaE;
                    similarColors.push(found);
                }
            });

            if (similarColors.length >= 5) {
                return similarColors.slice(0, 5);
            } else {
                return similarColors.slice(0, similarColors.length);
            }
        } else {
            return null;
        }
    }

    setRandomColor = () => {
        ReactGA.event({
            category: 'Button',
            action: 'Random Color Button Click',
        });

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
                    {/* <div className="brand">
                        <h3>Pigment</h3>
                    </div> */}
                    <button onClick={this.setRandomColor}>
                        {/* <Icon name="tint" /> */}
                        <Icon name="random" />
                    </button>
                    <div className="search-wrapper">
                        <SearchBar onSubmit={this.onSearchSubmit} colors={this.state.colors} />
                    </div>
                    <div className="filter-button">
                        <Dropdown multiple icon="filter">
                            <Dropdown.Menu>
                                <Dropdown.Header
                                    icon="tags"
                                    className="filterHeader"
                                    content="Filter by Product Line"
                                />
                                <Dropdown.Menu scrolling>{this.renderFilterList()}</Dropdown.Menu>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </nav>
            </header>
        );
    }

    onFilterClick = (e, { text }) => {
        e.stopPropagation();
        const filters = [...this.state.filters];
        const index = _.findIndex(filters, (item) => {
            return `${item.brand} ${item.productline}`.indexOf(text) > -1;
        });
        filters[index].active = !filters[index].active;
        this.setState({ filters, similarColors: this.getSimilarColors(this.state.currentColor) });
    };

    renderFilterList() {
        return this.state.filters.map((filter, index) => {
            return (
                <Dropdown.Item
                    key={index}
                    icon={filter.active ? 'check square outline' : 'square outline'}
                    text={filter.productline}
                    onClick={this.onFilterClick}
                />
            );
        });
    }

    renderMain() {
        var deltaWhite = this.state.currentColor ? calcDelta.getDeltaE(this.state.currentColor.hex, '#FFFFFF') : 100;
        if (this.state.currentColor !== null && this.state.similarColors !== null) {
            return (
                <main className={deltaWhite < 33 ? 'dark' : ''}>
                    <CurrentColor color={this.state.currentColor} />
                    <SimilarColors similarColors={this.state.similarColors} onClick={this.dimmerOpen} />
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
                <div id="snackbar">
                    <div>
                        The Delta (Δ) value indicates the difference between two colors. The lower the number, the
                        better the match!
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
