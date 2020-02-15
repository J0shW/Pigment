import _ from 'lodash';
import axios from 'axios';

export const getColors: GetColors = async () => {
    let colorList: Color[];
    if (localStorage.getItem(`colors`)) {
        colorList = await JSON.parse(localStorage.getItem(`colors`)!);
    }
    else {
        colorList = await axios.request<Color[]>({url: './colorsMatched.json'})
        .then((response) => response.data);   
    }
    return colorList;
};

export const getCurrentColor: GetCurrentColor = async (colors) => {
    let curColor: Color;
    if (localStorage.getItem(`currentColor`)) {
        curColor = await JSON.parse(localStorage.getItem(`currentColor`)!);
    }
    else {
        curColor = getRandomColor(colors);
    }
    return curColor;
}

export const getFilters: GetFilters = async (colors) => {
    let filterList: Filter[];
    if (localStorage.getItem(`filters`)) {
        filterList = await JSON.parse(localStorage.getItem(`filters`)!);
    }
    else {
        // Get unique product lines
        let productlines: any = _.uniqBy(colors, 'productline');

        // Create a list of filters from them with 'active' set to true
        filterList = productlines.map((line: Color) => {
            return { productline: `${line.brand} ${line.productline}`, active: true };
        });
    }

    return filterList;
};

export const getRandomColor: GetRandomColor = colors => {
    // Get a random color from the list
    const randomColor: Color = colors[Math.floor(Math.random() * colors.length)];

    return randomColor;
};

export const getSimilarColors: GetSimilarColors = (currentColor, colors, filters) => {
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
