import React from 'react';
import axios from 'axios';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import { getDeltaE } from '../helpers/calcDeltas';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';

import SearchBar from './SearchBar';
import FilterList from './FilterList';
import CurrentColor from './CurrentColor';
import SimilarColors from './SimilarColors';
import {
    getFilters,
    getRandomColor,
    getSimilarColors,
    resetMatchesScroll,
    resetResultsScroll,
} from '../helpers/generalHelper';

import '../styles/App.css';

const firebaseConfig = {
    apiKey: 'AIzaSyB2p6wKii_tTyGgFKYqp1dHDoPaYRzv-Rg',
    authDomain: 'pigment-ninja.firebaseapp.com',
    databaseURL: 'https://pigment-ninja.firebaseio.com',
    projectId: 'pigment-ninja',
    storageBucket: 'pigment-ninja.appspot.com',
    messagingSenderId: '903961965489',
    appId: '1:903961965489:web:28870dc52ef143242d8390',
    measurementId: 'G-5HQNCQ103V',
};

const InitialState: AppState = {
    currentColor: null,
    similarColors: null,
    colors: [],
    filters: [],
};

const colorDataVersion: number = 1;

// Initialize Firebase and Analytics
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

class App extends React.Component<{}, AppState> {
    // Retrieve the last state from localStorage
    state: AppState = localStorage.getItem(`appState${colorDataVersion}`)
        ? JSON.parse(localStorage.getItem(`appState${colorDataVersion}`) + '')
        : InitialState;

    async componentDidMount() {
        if (this.state.colors.length === 0) {
            // Track New User
            analytics.logEvent('new_user');

            // Load JSON color data
            axios
                .get('./colorsMatched.json')
                .then(response => {
                    // Load Color List
                    this.setState({ colors: response.data }, () => {
                        // Load Filter List
                        this.setState({ filters: getFilters(this.state.colors) }, () => {
                            // Set a random color
                            this.setCurrentColor(getRandomColor(this.state.colors));
                        });
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }

    componentDidUpdate() {
        // Remember state for the next mount
        if (this.state.currentColor != null) {
            localStorage.clear();
            localStorage.setItem(`appState${colorDataVersion}`, JSON.stringify(this.state));
        }
    }

    setCurrentColor: SetCurrentColor = color => {
        this.setState({ currentColor: color }, () => {
            // Set Similar Colors
            this.setState({
                similarColors: getSimilarColors(this.state.currentColor, this.state.colors, this.state.filters),
            });
        });

        // Reset scroll position of Similar Colors
        resetMatchesScroll();
        resetResultsScroll();
    };

    onSearchSubmit: SearchSubmit = color => {
        // Track Search Submit
        analytics.logEvent('search_submit', { colorid: color.id, colorname: color.name });

        this.setCurrentColor(color);
    };

    setFilters: SetFilters = filters => {
        this.setState({ filters }, () => {
            if (this.state.currentColor != null) {
                this.setCurrentColor(this.state.currentColor);
            }
        });
    };

    renderHeader() {
        return (
            <header>
                <nav>
                    <button onClick={() => this.setCurrentColor(getRandomColor(this.state.colors))}>
                        <Icon name="random" />
                    </button>
                    <SearchBar onSubmit={this.onSearchSubmit} colors={this.state.colors} />
                    <FilterList filters={this.state.filters} setfilters={this.setFilters} />
                </nav>
            </header>
        );
    }

    renderMain() {
        var deltaWhite = this.state.currentColor ? getDeltaE(this.state.currentColor.hex, '#FFFFFF') : 100;
        if (
            this.state.currentColor !== null &&
            this.state.currentColor !== undefined &&
            this.state.similarColors !== null
        ) {
            return (
                <main className={deltaWhite < 33 ? 'dark' : ''}>
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
