import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import { getDeltaE } from '../helpers/calcDeltas';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';

import SearchBar from './SearchBar';
import FilterList from './FilterList';
import CurrentColor from './CurrentColor';
import SimilarColors from './SimilarColors';
import {
    getColors,
    getFilters,
    getRandomColor,
    getSimilarColors,
    resetMatchesScroll,
    resetResultsScroll,
    getCurrentColor,
} from '../helpers/generalHelper';

import '../styles/App.css';

// Initialize Firebase and Analytics
require('dotenv').config();
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY!,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN!,
    databaseURL: process.env.REACT_APP_DATABASE_URL!,
    projectId: process.env.REACT_APP_PROJECT_ID!,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET!,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID!,
    appId: process.env.REACT_APP_APP_ID!,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID!,
};
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

// const colorDataVersion: number = 1;

const App: React.FC = () => {
    const [currentColor, setCurrentColor] = useState<Color>();
    const [similarColors, setSimilarColors] = useState<Color[]>();
    const [colors, setColors] = useState<Color[]>();
    const [filters, setFilters] = useState<Filter[]>();

    useEffect(() => {
        async function init() {
            // Get and Set JSON color data
            const colorList = await getColors();
            setColors([...colorList]);

            // Get and Set current color
            const curColor = await getCurrentColor(colorList);
            setCurrentColor(curColor);

            // Get and Set filters
            const filterList = await getFilters(colorList);
            setFilters(filterList);
        }

        init();      
    }, []);

    useEffect(() => {
        //Set Similar Colors
        if (colors && currentColor && filters) {
            setSimilarColors([...getSimilarColors(currentColor, colors, filters)]);
            
            // Reset scroll position of Similar Colors
            resetMatchesScroll();
            resetResultsScroll();
        }
    }, [colors, currentColor, filters]);

    useEffect(() => {
        if (colors) { localStorage.setItem(`colors`, JSON.stringify(colors)); }
    }, [colors]);

    useEffect(() => {
        if (currentColor) { localStorage.setItem(`currentColor`, JSON.stringify(currentColor)); }
    }, [currentColor]);

    useEffect(() => { if(filters) { localStorage.setItem(`filters`, JSON.stringify(filters)); }
    }, [filters]);

    const onSearchSubmit: SearchSubmit = color => {
        // Track Search Submit
        if (process.env.NODE_ENV === 'production') {
            analytics.logEvent('search_submit', { colorid: color.id, colorname: color.name });
        }

        setCurrentColor(color);
    };

    const onFilterChange: FilterChange = (filters) => {
        setFilters([...filters]);
    }

    const renderHeader = () => {
        return (
            <header>
                <nav>
                    <button onClick={() => setCurrentColor(getRandomColor(colors!))}>
                        <Icon name="random" />
                    </button>
                    <SearchBar onSubmit={onSearchSubmit} colors={colors!} />
                    <FilterList filters={filters} setfilters={onFilterChange} />
                </nav>
            </header>
        );
    }

    const renderMain = () => {
        var deltaWhite = currentColor ? getDeltaE(currentColor.hex, '#FFFFFF') : 100;
        if (
            currentColor !== null &&
            currentColor !== undefined &&
            similarColors !== null
        ) {
            return (
                <main className={deltaWhite < 33 ? 'dark' : ''}>
                    <CurrentColor color={currentColor} />
                    <SimilarColors similarColors={similarColors} />
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

    const renderFooter = () => {
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

    return (
        
        <div className="wrapper">
            {renderHeader()}
            {renderMain()}
            {renderFooter()}
            <div id="snackbar">
                <div>
                    The Delta (Δ) value indicates the difference between two colors. The lower the number, the
                    better the match!
                </div>
            </div>
        </div>
    );
}

export default App;
