import React from 'react';

const CurrentColor = (props) => {
    return (
        <section className="current-color" style={{ backgroundColor: props.color.hex }}>
            <div>
                <h4>{`${props.color.brand} ${props.color.productline}`}</h4>
            </div>
            <div>
                <h1>{props.color.name}</h1>
            </div>
            <div>
                <h4>{props.color.hex.toUpperCase()}</h4>
            </div>
        </section>
    );
};

export default CurrentColor;
