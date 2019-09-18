import PropTypes from 'prop-types';
import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label, Icon } from 'semantic-ui-react';
import CalcDeltas from '../calcDeltas';

// Semantic UI React Search Bar
// https://react.semantic-ui.com/modules/search/#types-category-custom

const categoryRenderer = ({ brand }) => <Label as="span" content={brand} />;

categoryRenderer.propTypes = {
    brand: PropTypes.string,
};

const resultRenderer = ({ name }) => <Label id={name} content={name} />;

resultRenderer.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
};

let source = {};

export default class SearchExampleCategory extends Component {
    initialState = {
        isLoading: false,
        results: [],
        value: '',
        colors: this.props.colors,
    };
    state = this.initialState;

    componentDidUpdate() {
        if (this.state.colors.length <= 0 && this.props.colors.length > 0) {
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
        source = {};
        // Put this.props.colors into the "source" variable
        colors.forEach((color) => {
            let resArr = [];
            const brand = `${color.brand} ${color.productline}`;
            if (brand in source) {
                resArr = source[brand].results;
            }

            resArr.push(color);

            source[brand] = {
                brand: brand,
                results: resArr,
            };
        });
    };

    handleResultSelect = (e, { result }) => {
        //this.setState({ value: result.title });
        this.setState({ value: '' });
        // Pass the searched color to App.js event handler
        this.props.onSubmit(result);
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            // Clear the state back to default values
            if (this.state.value.length < 1) return this.setState(this.initialState);

            let filteredResults = {};

            // Create an array of the words that were searched
            const searchTerms = this.state.value.trim().split(' ');

            // Loop over every color in the database
            for (const i in source) {
                const brand = source[i].brand;
                const colors = source[i].results;

                // Checks for a match with the given color against all search terms
                const isMatch = (color) => {
                    // split the color's name and brand into an array
                    let colorTerms = color.name.split(' ').concat(color.brand.split(' '));

                    // return true if 'every' searchTerm matches a colorTerm
                    return searchTerms.every((term) => {
                        // Create regex to check colorTerms against
                        const re = new RegExp(_.escapeRegExp(term), 'i');

                        // return true if any of the colorTerms matches the regex
                        return colorTerms.some((colorTerm, index) => {
                            if (re.test(colorTerm)) {
                                colorTerms.splice(index, 1);
                                return true;
                            } else {
                                return false;
                            }
                        });
                    });
                };

                // Call the "isMatch" function for each color in "colors", then save the "true" results to an array
                const results = _.filter(colors, isMatch);

                // Concat the results to the filteredResults collection
                if (results.length) filteredResults[i] = { brand, results };
            }

            // Save the results to the state
            this.setState({
                isLoading: false,
                results: filteredResults,
            });
        }, 300);
    };

    render() {
        const { isLoading, value, results } = this.state;

        return (
            <nav>
                <button>
                    <Icon name="tint" />
                </button>
                <div className="search-wrapper">
                    <Search
                        input={{ icon: 'search', iconPosition: 'left' }}
                        id="searchInput"
                        fluid
                        category
                        categoryRenderer={categoryRenderer}
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                            leading: true,
                        })}
                        resultRenderer={resultRenderer}
                        results={results}
                        value={value}
                        {...this.props}
                    />
                </div>
                <button>
                    <Icon name="filter" />
                </button>
            </nav>
        );
    }
}
