import PropTypes from 'prop-types';
import _ from 'lodash';
import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import CalcDeltas from '../calcDeltas';

// Semantic UI React Search Bar
// https://react.semantic-ui.com/modules/search/#types-standard-custom

let source = null;

const resultRenderer = (result) => (
    <div className="customResult">
        <div>
            <div className="resultTitle">
                <b>{result.title}</b>
            </div>
            <div className="resultDescription">
                {result.description}
                <i>{result.color.productcode === '-' ? '' : ' - ' + result.color.productcode}</i>
            </div>
        </div>
        <div className="colorCircle" style={{ backgroundColor: result.color.hex }}></div>
    </div>
);

resultRenderer.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

export default class SearchExampleCategory extends Component {
    initialState = {
        isLoading: false,
        results: [],
        value: '',
        colors: this.props.colors,
    };
    state = this.initialState;

    componentDidUpdate() {
        //if (this.state.colors.length <= 0 && this.props.colors.length > 0) {
        if ((source === null) & (this.props.colors.length > 0)) {
            this.initialState.colors = this.props.colors;
            this.setState({ colors: this.props.colors });
            this.setSource(this.props.colors);
        }
    }

    calculateDeltas = () => {
        //console.log(this.state.colors);
        new CalcDeltas();
    };

    setSource = (colors) => {
        source = [];
        // Put this.props.colors into the "source" variable
        colors.forEach((color) => {
            source.push({
                key: color.id,
                title: color.name,
                description: `${color.brand} ${color.productline}`,
                color: color,
            });
        });
    };

    handleResultSelect = (e, { result }) => {
        //this.setState({ value: result.title });
        this.setState({ value: '' });
        // Pass the searched color to App.js event handler
        this.props.onSubmit(result.color);

        document.getElementById('searchInput').blur();
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            if (this.state.value.length < 1) return this.setState(this.initialState);

            // Step 1: Get everything that STARTS WITH the searched value
            const searchValue = _.escapeRegExp(this.state.value.toLowerCase());
            const re = new RegExp('^' + searchValue, 'i');
            const isStartWith = (result) => re.test(result.title.toLowerCase());

            let matches = _.filter(source, isStartWith);
            let sortedMatches = _.sortBy(matches, [(match) => match.title]);

            // Step 2: Get everything that contains the searched value as a WHOLE WORD
            const isWholeWord = (result) => {
                const containsValue = result.title.toLowerCase().indexOf(` ${searchValue}`, 1) > -1;
                return containsValue && !isStartWith(result);
            };

            matches = _.filter(source, isWholeWord);
            sortedMatches = [...sortedMatches, ..._.sortBy(matches, [(match) => match.title])];

            // Step 2: Get everything that CONTAINS the searched value
            const isContains = (result) => {
                const containsValue = result.title.toLowerCase().indexOf(searchValue, 1) > -1;
                return (
                    containsValue &&
                    result.title.toLowerCase().indexOf(` ${searchValue}`, 1) === -1 &&
                    !isStartWith(result)
                );
            };

            matches = _.filter(source, isContains);
            sortedMatches = [...sortedMatches, ..._.sortBy(matches, [(match) => match.title])];

            this.setState({
                isLoading: false,
                results: sortedMatches,
            });
        }, 300);
    };

    render() {
        const { isLoading, value, results } = this.state;

        return (
            <Search
                input={{ icon: 'search', iconPosition: 'left' }}
                id="searchInput"
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true,
                })}
                results={results}
                value={value}
                resultRenderer={resultRenderer}
                {...this.props}
            />
        );
    }
}
