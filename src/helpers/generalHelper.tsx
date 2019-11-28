import _ from 'lodash';

export const getFilters: GetFilters = colors => {
    // Get unique product lines
    let productlines: any = _.uniqBy(colors, 'productline');

    // Create a list of filters from them with 'active' set to true
    const filterlist: Array<Filter> = productlines.map((line: Color) => {
        return { productline: `${line.brand} ${line.productline}`, active: true };
    });

    return filterlist;
};

export const getRandomColor: GetRandomColor = colors => {
    // Get a random color from the list
    const randomColor: Color = colors[Math.floor(Math.random() * colors.length)];

    return randomColor;
};

export const getSimilarColors: GetSimilarColors = (currentColor, colors, filters) => {
    if (currentColor && currentColor.matches) {
        let similarColors: Array<Color> = [];

        _.forEach(currentColor.matches, match => {
            const found: Color | undefined = _.find(colors, color => {
                if (color.id === match.id) {
                    const filterMatch: boolean = _.some(filters, {
                        productline: `${color.brand} ${color.productline}`,
                        active: true,
                    });
                    return filterMatch;
                }
                return false;
            });

            if (found) {
                found.delta = match.deltaE;
                similarColors.push(found);
            }
        });

        if (similarColors.length >= 5) {
            return similarColors.slice(0, 5);
        } else {
            return similarColors.slice(0, similarColors.length);
        }
    } else {
        return null;
    }
};

export const resetResultsScroll: ResetScroll = () => {
    const resultsElem = document.getElementsByClassName('results transition');
    if (resultsElem !== null && resultsElem !== undefined && resultsElem.length > 0) {
        resultsElem[0].scrollTo(0, 0);
    }
};

export const resetMatchesScroll: ResetScroll = () => {
    const resultsElem = document.getElementsByClassName('similar-colors-wrapper');
    if (resultsElem !== null && resultsElem !== undefined && resultsElem.length > 0) {
        resultsElem[0].scrollTo(0, 0);
    }
};
