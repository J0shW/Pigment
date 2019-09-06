import React from 'react';

const CurrentColor = (props) => {
    return (
        <div className="row" style={{ backgroundColor: props.color.hex, height: '30%' }}>
            <div className="column mainColor color">
                <div style={{ width: '20%' }}>
                    <h4>{`${props.color.brand} ${props.color.productline}`}</h4>
                </div>
                <div style={{ width: '60%' }}>
                    <h1>{props.color.name}</h1>
                </div>
                <div style={{ width: '20%' }}>
                    <h4>{props.color.hex}</h4>
                </div>
                {/* <div className="save-color">
                    <span>
                        <i className="bookmark outline icon"></i>
                    </span>
                </div> */}
            </div>
        </div>
    );
};

export default CurrentColor;
