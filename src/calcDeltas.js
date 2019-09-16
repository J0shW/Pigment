import ColorConvert from 'color-convert';
import axios from 'axios';
import _ from 'lodash';
var DeltaE = require('delta-e');

export default class CalcDeltas {
    constructor() {
        axios
            .get('./colors.json')
            .then((response) => {
                this.startCalculation(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    getDeltaE = (color1, color2) => {
        // Convert color 1 to LAB format
        color1 = ColorConvert.hex.lab.raw(color1);
        const lab1 = { L: color1[0], A: color1[1], B: color1[2] };

        // Convert color 2 to LAB format
        color2 = ColorConvert.hex.lab.raw(color2);
        const lab2 = { L: color2[0], A: color2[1], B: color2[2] };

        // Get the color difference
        return DeltaE.getDeltaE00(lab1, lab2);
    };

    startCalculation = async (colors) => {
        // Get the unique product lines
        let productlines = _.uniqBy(colors, 'productline');

        const newColors = colors.map((color1) => {
            let matches = [];
            colors.forEach((color2) => {
                // Check that we aren't matching against the same color
                if (color2.id !== color1.id) {
                    // Calculate DeltaE
                    const deltaE = this.getDeltaE(color1.hex, color2.hex);

                    // Push Delta value into array
                    matches.push({ id: color2.id, deltaE });
                }
            });

            // Sort all matches
            matches = _.sortBy(matches, ['deltaE']);

            // Get top 5 matches for each product line
            color1.matches = [];
            productlines.forEach((productline) => {
                let lineColors = _.filter(matches, (match) => {
                    const found = _.find(colors, ['id', match.id]);
                    const myValue = found.productline === productline.productline;
                    return myValue;
                });
                lineColors = lineColors.slice(0, 5);
                color1.matches = [...color1.matches, ...lineColors];
            });

            // Sort final matches
            color1.matches = _.sortBy(color1.matches, ['deltaE']);
            return color1;
        });

        console.log(newColors);
        this.downloadObjectAsJson(newColors, 'colorsMatched');
    };

    downloadObjectAsJson = (exportObj, exportName) => {
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', exportName + '.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();

        setTimeout(function() {
            //document.body.removeChild(downloadAnchorNode);
            //downloadAnchorNode.remove();
            //URL.revokeObjectURL(source);
        }, 10000);
    };
}
