import React from 'react';

interface SimilarColorsProps {
    similarColors: Array<Color> | undefined;
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
    const renderColors = () => {
        if (similarColors) {
            return similarColors!.map((color, index) => {
                const delta = color.delta ? Math.round(color.delta * 100) / 100 : 0;
                return (
                    <div key={index} className="similar-color" style={{ backgroundColor: color.hex }}>
                        <div className="color-header">
                            <h4>{`${color.brand} ${color.productline}`}</h4>
                            <h2>{color.name.charAt(0).toUpperCase() + color.name.slice(1)}</h2>
                        </div>
                        <div className="delta-content">
                            <h4 className="delta" onClick={dimmerOpen}>
                                {`Δ = ${parseFloat(delta.toString()).toFixed(2)}`}
                            </h4>
                            {renderMatchStatus(index, color.hex)}
                        </div>
                    </div>
                );
            });
        }
    } 

    const renderMatchStatus = (index: number, hex: string) => {
        if (index === 0) {
            return (
                <div className="match-status best-match">
                    <div className=" hr transparent"></div> 
                    <h4>Best Match</h4>
                    <div className="hr"></div>
                </div>
            );
        }
        else if (index === similarColors!.length -1) {
            return (
                <div className="match-status good-match">
                    <div className="arrow-container">
                        <div className=" hr"></div> 
                        <span className="arrow"></span>
                    </div>
                    <h4>Good Match</h4>
                    <div className="hr transparent"></div>
                </div>
            );
        }
        else {
            return (
                <div className="match-status">
                    <div className="hr"></div>
                </div>
            );
        }
    }

    return <section className="similar-colors-wrapper" onWheel = {(e) => wheelEvent(e)}>{renderColors()}</section>;
};

export default SimilarColors;
