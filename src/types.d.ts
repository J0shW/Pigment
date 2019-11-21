// Objects
type AppState = {
    currentColor: Color | null;
    similarColors: Array<Color> | null;
    colors: Array<Color>;
    filters: Array<Filter>;
};

type Color = {
    id: number;
    brand: string;
    productline: string;
    name: string;
    productcode: string;
    hex: string;
    matches?: Array<Match>;
    delta?: number;
};

type Match = {
    id: number;
    deltaE: number;
};

type Filter = {
    productline: string;
    active: boolean;
};

type SearchResult = {
    key: number;
    title: string;
    description: string;
    color: Color;
};

type SearchBarState = {
    isLoading: boolean;
    results: Array;
    value: string;
    colors: Array<Color>;
};

// Functions
type GetSimilarColors = (
    currentColor: Color | null,
    colors: Array<Color>,
    filters: Array<Filter>,
) => Array<Color> | null;

type SetCurrentColor = (color: Color) => void;

type GetRandomColor = (colors: Array<Color>) => Color;

type SearchSubmit = (color: Color) => void;

type GetFilters = (colors: Array<Color>) => Array<Filter>;
type SetFilters = (filters: Array<Filter>) => void;

type DimmerOpen = () => void;
