import React from 'react';

interface CurrentColorProps {
    color: Color;
}

const CurrentColor: React.FC<CurrentColorProps> = ({ color }) => {
    return (
        <section className="current-color" style={{ backgroundColor: color.hex }}>
            <div>
                <h4>{`${color.brand} ${color.productline}`}</h4>
            </div>
            <div>
                <h1>{color.name}</h1>
            </div>
            <div>
                <h4>{color.hex.toUpperCase()}</h4>
            </div>
        </section>
    );
};

export default CurrentColor;
