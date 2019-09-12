import ColorConvert from 'color-convert';
import axios from 'axios';
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
        color1 = ColorConvert.hex.lab.raw(color1);
        //console.log('1: ' + color1);
        const lab1 = { L: color1[0], A: color1[1], B: color1[2] };

        color2 = ColorConvert.hex.lab.raw(color2);
        //console.log('2: ' + color2);
        const lab2 = { L: color2[0], A: color2[1], B: color2[2] };

        return DeltaE.getDeltaE00(lab1, lab2);
        //return Math.abs(Math.floor(DeltaE.getDeltaE00(lab1, lab2)) - 100);
    };

    startCalculation = (colors) => {
        const newColors = colors.map((color1) => {
            colors.forEach((color2) => {
                // Check that we aren't matching against the same color
                if (color2.id !== color1.id) {
                    // Calculate DeltaE
                    const deltaE = this.getDeltaE(color1.hex, color2.hex);

                    // Check if DeltaE is low enough to bother recording
                    if (deltaE <= 4) {
                        // Create Delta array if it doesn't exist
                        if (!color1.matches) {
                            color1.matches = [];
                        }

                        // Push Delta value into array
                        color1.matches.push({ id: color2.id, deltaE });
                    }
                }
            });
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
        downloadAnchorNode.remove();
    };
}
