import { useState } from 'react';

import { Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import AppContextProvider from '../../context/AppContext';
import NotFound from '../common/pagemessages/NotFound';
import LeftBar from '../leftbar/LeftBar';
import Home from '../home/Home';

import './App.sass';

function App() {
    const [leftBarShown, setLeftBarShown] = useState<boolean>(true);
    const [leftBarExpanded, setLeftBarExpanded] = useState<boolean>(false);

    const handleToggleLeftBarShown = (newValue: boolean) => {
        if (leftBarShown !== newValue) setLeftBarShown(newValue);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <AppContextProvider
                leftBarExpanded={leftBarExpanded}
                onLeftBarExpand={setLeftBarExpanded}
                leftBarShown={leftBarShown}
                onToggleLeftBarShown={handleToggleLeftBarShown}
            >
                <div className="app" id="app">
                    {leftBarShown && <LeftBar />}
                    <div
                        className={
                            leftBarShown
                                ? leftBarExpanded
                                    ? 'page page-shrinked'
                                    : 'page page-expanded'
                                : 'page page-full'
                        }
                    >
                        <div className="pagecontent">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <Home />
                                    }
                                />
                                <Route
                                    path="/home"
                                    element={
                                        <Home />
                                    }
                                />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </AppContextProvider>
        </DndProvider>
    );
}

export default App;
