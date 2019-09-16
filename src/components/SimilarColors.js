import React from 'react';

const SimilarColors = (props) => {
    const renderColors = props.similarColors.map((color, index) => {
        return (
            <div key={index} className="column similarColor color" style={{ backgroundColor: color.hex }}>
                <h4>{`${color.brand} ${color.productline}`}</h4>
                <h2>{color.name.charAt(0).toUpperCase() + color.name.slice(1)}</h2>
                <h4>{`Δ=${parseFloat(Math.round(color.deltaE * 100) / 100).toFixed(2)}`}</h4>
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
            {renderColors}
        </div>
    );
};

export default SimilarColors;
