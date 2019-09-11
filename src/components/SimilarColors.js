import React from 'react';
import ColorConvert from 'color-convert';
import _ from 'lodash';
var DeltaE = require('delta-e');

const SimilarColors = (props) => {
    let orderedColors = props.similarColors;
    const getDeltaE = (color1, color2) => {
        color1 = ColorConvert.hex.lab.raw(color1);
        //console.log('1: ' + color1);
        const lab1 = { L: color1[0], A: color1[1], B: color1[2] };

        color2 = ColorConvert.hex.lab.raw(color2);
        //console.log('2: ' + color2);
        const lab2 = { L: color2[0], A: color2[1], B: color2[2] };

        //console.log(DeltaE.getDeltaE00(lab1, lab2));
        return Math.abs(Math.floor(DeltaE.getDeltaE00(lab1, lab2)) - 100);
    };

    const orderColors = () => {
        props.similarColors.forEach((color) => {
            color.deltaE = getDeltaE(props.currentColor.hex, color.hex);
        });

        orderedColors = _.orderBy(props.similarColors, ['deltaE'], ['desc']);
    };

    const renderColors = props.similarColors.map((color, index) => {
        return (
            <div key={index} className="column similarColor color" style={{ backgroundColor: color.hex }}>
                <h4>{`${color.brand} ${color.productline}`}</h4>
                <h2>{color.name.charAt(0).toUpperCase() + color.name.slice(1)}</h2>
                <h4>{`${getDeltaE(props.currentColor.hex, color.hex)} %`}</h4>
                {/* <div className="save-color">
                    <span>
                        <i className="bookmark outline icon"></i>
                    </span>
                    </div> */}
            </div>
        );
    });

    return (
        <div className="row" style={{ height: '70%' }}>
            {/* {orderColors()} */}
            {renderColors}
        </div>
    );
};

export default SimilarColors;
