import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import { Search, SearchProps, SearchResultData, SearchResultProps } from 'semantic-ui-react';
import { calcDeltas } from '../helpers/calcDeltas';
import { resetResultsScroll } from '../helpers/generalHelper';

// Semantic UI React Search Bar
// https://react.semantic-ui.com/modules/search/#types-standard-custom

let source: Array<SearchResult>;

const resultRenderer = (props: SearchResultProps) => (
    // const resultRenderer = (result: any) => (
    <div className="customResult">
        <div>
            <div className="resultTitle">
                <b>{props.title}</b>
            </div>
            <div className="resultDescription">
                {props.description}
                <i>{props.color.productcode === '-' ? '' : ' - ' + props.color.productcode}</i>
            </div>
        </div>
        <div className="colorCircle" style={{ backgroundColor: props.color.hex }}></div>
    </div>
);

resultRenderer.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

interface SearchBarProps {
    onSubmit: SearchSubmit;
    colors: Array<Color>;
}

export default class SearchExampleCategory extends React.Component<SearchBarProps, SearchBarState> {
    initialState = {
        isLoading: false,
        results: [],
        value: '',
        colors: this.props.colors,
    };
    state: SearchBarState = this.initialState;

    componentDidUpdate() {
        //if (this.state.colors.length <= 0 && this.props.colors.length > 0) {
        if (source === undefined && this.props.colors.length > 0) {
            this.initialState.colors = this.props.colors;
            this.setState({ colors: this.props.colors });
            this.setSource(this.props.colors);
        }
    }

    calculateDeltas = () => {
        //console.log(this.state.colors);
        calcDeltas();
    };

    setSource = (colors: Array<Color>) => {
        source = [];
        // Put this.props.colors into the "source" variable
        colors.forEach(color => {
            source.push({
                key: color.id,
                title: color.name,
                description: `${color.brand} ${color.productline}`,
                color: color,
            });
        });
    };

    handleResultSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: SearchResultData) => {
        this.setState({ value: '' });
        // Pass the searched color to App.js event handler
        this.props.onSubmit(data.result.color);

        const input = document.getElementById('searchInput');
        if (input) {
            input.blur();
        }
    };

    handleSearchChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, data: SearchProps) => {
        this.setState({ isLoading: true, value: data.value ? data.value : '' });

        setTimeout(() => {
            if (this.state.value.length < 1) return this.setState(this.initialState);

            // Reset Scroll position of results list
            resetResultsScroll();

            // Step 1: Get everything that STARTS WITH the searched value
            const searchValue = _.escapeRegExp(this.state.value.toLowerCase());
            const re = new RegExp('^' + searchValue, 'i');
            const isStartWith = (result: SearchResult) => re.test(result.title.toLowerCase());

            let matches = _.filter(source, isStartWith);
            let sortedMatches = _.sortBy(matches, [match => match.title]);

            // Step 2: Get everything that contains the searched value as a WHOLE WORD
            const isWholeWord = (result: SearchResult) => {
                const containsValue = result.title.toLowerCase().indexOf(` ${searchValue}`, 1) > -1;
                return containsValue && !isStartWith(result);
            };

            matches = _.filter(source, isWholeWord);
            sortedMatches = [...sortedMatches, ..._.sortBy(matches, [match => match.title])];

            // Step 2: Get everything that CONTAINS the searched value
            const isContains = (result: SearchResult) => {
                const containsValue = result.title.toLowerCase().indexOf(searchValue, 1) > -1;
                return (
                    containsValue &&
                    result.title.toLowerCase().indexOf(` ${searchValue}`, 1) === -1 &&
                    !isStartWith(result)
                );
            };

            matches = _.filter(source, isContains);
            sortedMatches = [...sortedMatches, ..._.sortBy(matches, [match => match.title])];

            this.setState({
                isLoading: false,
                results: sortedMatches,
            });
        }, 300);
    };

    render() {
        const { isLoading, value, results } = this.state;

        return (
            <div className="search-wrapper">
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
            </div>
        );
    }
}
