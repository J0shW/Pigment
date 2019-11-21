import React from 'react';
import _ from 'lodash';
import { Dropdown, DropdownItemProps } from 'semantic-ui-react';

interface FilterListProps {
    filters: Array<Filter>;
    setfilters: SetFilters;
}

const FilterList: React.FC<FilterListProps> = ({ filters, setfilters }) => {
    const renderFilterList = (filters: Array<Filter>) => {
        return filters.map((filter, index) => {
            return (
                <Dropdown.Item
                    key={index}
                    icon={filter.active ? 'check square outline' : 'square outline'}
                    text={filter.productline}
                    onClick={onFilterClick}
                />
            );
        });
    };

    const onFilterClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: DropdownItemProps) => {
        event.stopPropagation();
        const index = _.findIndex(filters, item => {
            return item.productline.indexOf(data.text as string) > -1;
        });
        filters[index].active = !filters[index].active;

        setfilters(filters);
    };

    return (
        <div className="filter-button">
            <Dropdown multiple icon="filter">
                <Dropdown.Menu>
                    <Dropdown.Header icon="tags" className="filterHeader" content="Filter by Product Line" />
                    <Dropdown.Menu scrolling>{renderFilterList(filters)}</Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default FilterList;
