import ColorConvert from 'color-convert';
import axios from 'axios';
import _ from 'lodash';

//@ts-ignore
import DeltaE from 'delta-e'; // No @types definition

export const getDeltaE = (color1: string, color2: string) => {
    // Convert color 1 to LAB format
    const color1Arr: [number, number, number] = ColorConvert.hex.lab.raw(color1);
    const lab1 = { L: color1Arr[0], A: color1Arr[1], B: color1Arr[2] };

    // Convert color 2 to LAB format
    const color2Arr: [number, number, number] = ColorConvert.hex.lab.raw(color2);
    const lab2 = { L: color2Arr[0], A: color2Arr[1], B: color2Arr[2] };

    // Get the color difference
    return DeltaE.getDeltaE00(lab1, lab2);
};

export const calcDeltas = () => {
    axios
        .get('./colors.json')
        .then(response => {
            startCalculation(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
};

const startCalculation = async (colors: Array<Color>) => {
    // Get the unique product lines
    let productlines = _.uniqBy(colors, 'productline');

    const newColors = colors.map(color1 => {
        let matches: Array<Match> = [];
        colors.forEach(color2 => {
            // Check that we aren't matching against the same color
            if (color2.id !== color1.id) {
                // Calculate DeltaE
                const deltaE = getDeltaE(color1.hex, color2.hex);

                // Push Delta value into array
                matches.push({ id: color2.id, deltaE });
            }
        });

        // Sort all matches
        matches = _.sortBy(matches, ['deltaE']);

        // Get top 5 matches for each product line
        color1.matches = [];
        productlines.forEach(productline => {
            let lineColors: any = _.filter(matches, match => {
                const found: Color | undefined = _.find(colors, ['id', match.id]);

                return found && found.productline === productline.productline;
            });
            lineColors = lineColors.slice(0, 5);
            color1.matches = [...color1.matches, ...lineColors];
        });

        // Sort final matches
        color1.matches = _.sortBy(color1.matches, ['deltaE']);
        return color1;
    });

    console.log(newColors);
    downloadObjectAsJson(newColors, 'colorsMatched');
};

const downloadObjectAsJson = (exportObj: Array<Color>, exportName: string) => {
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
