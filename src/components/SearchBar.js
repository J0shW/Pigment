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
            <div>
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
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            if (this.state.value.length < 1) return this.setState(this.initialState);

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
            const isMatch = (result) => re.test(result.title);

            this.setState({
                isLoading: false,
                results: _.filter(source, isMatch),
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
