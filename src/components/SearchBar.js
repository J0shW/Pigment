import PropTypes from "prop-types";
import _ from "lodash";
import React, { Component } from "react";
import { Search, Label } from "semantic-ui-react";

// Semantic UI React Search Bar
// https://react.semantic-ui.com/modules/search/#types-category-custom

const categoryRenderer = ({ name }) => <Label as="span" content={name} />;

categoryRenderer.propTypes = {
  name: PropTypes.string
};

const resultRenderer = ({ title }) => <Label id={title} content={title} />;

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

let source = {};

export default class SearchExampleCategory extends Component {
  initialState = {
    isLoading: false,
    results: [],
    value: "",
    colors: this.props.colors
  };
  state = this.initialState;

  componentDidUpdate() {
    if (this.state.colors.length <= 0 && this.props.colors.length > 0) {
      this.initialState.colors = this.props.colors;
      this.setState({ colors: this.props.colors });
      this.setSource(this.props.colors);
    }
  }

  setSource = colors => {
    source = {};
    // Put this.props.colors into the "source" variable
    colors.forEach(color => {
      let resArr = [];
      if (color.brand in source) {
        resArr = source[color.brand].results;
      }

      resArr.push(color);

      source[color.brand] = {
        name: color.brand,
        results: resArr
      };
    });
  };

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      // Clear the state back to default values
      if (this.state.value.length < 1) return this.setState(this.initialState);

      let filteredResults = {};

      // Create an array of the words that were searched
      const searchTerms = this.state.value.trim().split(" ");

      // Loop over every color in the database
      for (const brand in source) {
        const name = source[brand].name;
        const colors = source[brand].results;

        // Checks for a match with the given color against all search terms
        const isMatch = color => {
          // split the color's name and brand into an array
          let colorTerms = color.title
            .split(" ")
            .concat(color.brand.split(" "));

          // return true if 'every' searchTerm matches a colorTerm
          return searchTerms.every(term => {
            // Create regex to check colorTerms against
            const re = new RegExp(_.escapeRegExp(term), "i");

            // return true if any of the colorTerms matches the regex
            return colorTerms.some((colorTerm, index) => {
              if (re.test(colorTerm)) {
                console.log(colorTerms.splice(index, 1));
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
        if (results.length) filteredResults[brand] = { name, results };
      }

      // Save the results to the state
      this.setState({
        isLoading: false,
        results: filteredResults
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <div
        id="searchBar"
        className="ui secondary menu"
        style={{ height: "50px" }}
      >
        <button className="ui item icon button">
          <i className="bars icon"></i>
        </button>

        <form
          onSubmit={this.onFormSubmit}
          className="ui secondary menu fluid form"
          id="searchForm"
        >
          <Search
            fluid
            category
            categoryRenderer={categoryRenderer}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true
            })}
            resultRenderer={resultRenderer}
            results={results}
            value={value}
            {...this.props}
          />
        </form>

        <button className="ui item icon button">
          <i className="filter icon"></i>
        </button>
      </div>
    );
  }
}
