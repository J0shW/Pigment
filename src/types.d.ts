// Objects
type AppState = {
    currentColor: Color | null;
    similarColors: Color[] | null;
    colors: Color[];
    filters: Filter[];
};

type Color = {
    id: number;
    brand: string;
    productline: string;
    name: string;
    productcode: string;
    hex: string;
    matches?: Match[];
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
    colors: Color[];
};

// Functions
type GetSimilarColors = (
    currentColor: Color,
    colors: Color[],
    filters: Filter[],
) => Array<Color>;

type GetColors = () => Promise<Color[]>;

type GetCurrentColor = (colors: Color[]) => Promise<Color>;

type GetRandomColor = (colors: Color[]) => Color;

type SearchSubmit = (color: Color) => void;

type GetFilters = (colors: Color[]) => Promise<Filter[]>;
type FilterChange = (filters: Filter[]) => void;

type DimmerOpen = () => void;

type ResetScroll = () => void;
