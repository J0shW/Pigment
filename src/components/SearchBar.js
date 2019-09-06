import React from 'react';

class SearchBar extends React.Component {
    state = { term: '' };

    componentDidMount() {
        //stuff
    }

    onFormSubmit = (event) => {
        event.preventDefault();

        this.props.onSubmit(this.state.term);
    };

    render() {
        return (
            <div id="searchBar" className="ui secondary menu" style={{ height: '50px' }}>
                <button className="ui item icon button">
                    <i className="bars icon"></i>
                </button>

                <form onSubmit={this.onFormSubmit} className="ui secondary menu fluid form">
                    <div className="ui fluid icon input search-colors">
                        <input
                            type="text"
                            placeholder="Search colors"
                            value={this.state.term}
                            onChange={(e) =>
                                this.setState({
                                    term: e.target.value,
                                })
                            }
                        />
                        <i className="search icon"></i>
                    </div>
                </form>

                <button className="ui item icon button">
                    <i className="filter icon"></i>
                </button>
            </div>
        );
    }
}

export default SearchBar;
