import React from 'react';

interface SimilarColorsProps {
    similarColors: Array<Color>;
}

const dimmerOpen: DimmerOpen = () => {
    var snackbar = document.getElementById('snackbar');
    if (snackbar) {
        snackbar.className = 'show';
    }

    setTimeout(function() {
        if (snackbar) {
            snackbar.className = snackbar.className.replace('show', '');
        }
    }, 3000);
};

const wheelEvent = (e: React.WheelEvent<HTMLElement>) => {
    if (e.deltaY > 0) e.currentTarget.scrollLeft += 100;
    else e.currentTarget.scrollLeft -= 100; 
};

const SimilarColors: React.FC<SimilarColorsProps> = ({ similarColors }) => {
    const renderColors = similarColors.map((color, index) => {
        const delta = color.delta ? Math.round(color.delta * 100) / 100 : 0;
        return (
            <div key={index} className="similar-color" style={{ backgroundColor: color.hex }}>
                <div>
                    <h4>{`${color.brand} ${color.productline}`}</h4>
                    <h2>{color.name.charAt(0).toUpperCase() + color.name.slice(1)}</h2>
                </div>
                <div>
                    <h4 className="delta" onClick={dimmerOpen}>
                        {/* {`Δ=${parseFloat(Math.round(color.delta * 100) / 100).toFixed(2)}`} */}
                        {`Δ=${parseFloat(delta.toString()).toFixed(2)}`}
                    </h4>
                </div>
            </div>
        );
    });

    return <section className="similar-colors-wrapper" onWheel = {(e) => wheelEvent(e)}>{renderColors}</section>;
};

export default SimilarColors;
