import PropTypes from 'prop-types';
import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label, Dropdown, Menu, Icon } from 'semantic-ui-react';
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
            <Menu>
                <Menu.Item name="tint">
                    <Icon name="tint" />
                </Menu.Item>

                <Menu.Item id="searchItem">
                    {/* <Input className="icon" icon="search" placeholder="Search..." /> */}
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
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown icon="filter" item simple direction="right">
                        <Dropdown.Menu>
                            <Dropdown.Header content="Filter by Product Line" />
                            {/* <Dropdown.Divider /> */}
                            <Dropdown.Item icon="" text="Citadel Base" />
                            <Dropdown.Item icon="check" text="Citadel Dry" />
                            <Dropdown.Item icon="check" text="Citadel Layer &amp; Edge" />
                            <Dropdown.Item icon="" text="Reaper HD" />
                            <Dropdown.Item icon="" text="Reaper MSP" />
                            <Dropdown.Item icon="" text="Reaper Pro" />
                            <Dropdown.Item icon="check" text="Privateer Press P3" />
                            <Dropdown.Item icon="check" text="Vallejo Game Color" />
                            <Dropdown.Item icon="check" text="Vallejo Model Color" />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>

            // <div id="searchBar" className="ui secondary menu" style={{ height: '50px' }}>
            //     <button className="ui item icon button" onClick={this.calculateDeltas}>
            //         <i className="calculator icon"></i>
            //     </button>

            //     <form className="ui secondary menu fluid form" id="searchForm">
            //         <Search
            //             fluid
            //             category
            //             categoryRenderer={categoryRenderer}
            //             loading={isLoading}
            //             onResultSelect={this.handleResultSelect}
            //             onSearchChange={_.debounce(this.handleSearchChange, 500, {
            //                 leading: true,
            //             })}
            //             resultRenderer={resultRenderer}
            //             results={results}
            //             value={value}
            //             {...this.props}
            //         />
            //     </form>

            //     {/* <button className="ui item icon button">
            //         <i className="filter icon"></i>
            //     </button> */}
            //     <Menu>
            //         <Menu.Menu position="right">
            //             <Dropdown icon="filter" floating button direction="right" className="icon">
            //                 <Dropdown.Menu>
            //                     <Dropdown.Header icon="tags" content="Filter by Product Line" />
            //                     <Dropdown.Divider />
            //                     <Dropdown.Item icon="check" text="Important" />
            //                     <Dropdown.Item icon="" text="Announcement" />
            //                     <Dropdown.Item icon="check" text="Discussion" />
            //                 </Dropdown.Menu>
            //             </Dropdown>
            //         </Menu.Menu>
            //     </Menu>
            // </div>
        );
    }
}
