import { createContext } from 'react';

export type AlertCallback = (message: string, reason?: any) => void;

interface AppContextProviderProps {
    leftBarExpanded: boolean;
    leftBarShown: boolean;
    onLeftBarExpand: (newValue: boolean) => void;
    onToggleLeftBarShown: (newValue: boolean) => void;
    children: any;
}

export const AppContext = createContext({} as AppContextProviderProps);
AppContext.displayName = 'AppContext';

const AppContextProvider: React.FC<AppContextProviderProps> = (props) => {
    return (
        <AppContext.Provider value={props}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
