import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@store/index";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "@store/rootReducer";

export const customRenderWithProvider = (
    ui,
    ContextProvider,
    { providerProps, ...renderOptions }
) => {
    return render(
        <BrowserRouter>
            <Provider
                store={configureStore({
                    reducer: rootReducer,
                    middleware: (getDefaultMiddleware) =>
                        getDefaultMiddleware({ serializableCheck: false }),
                })}
            >
                <ContextProvider.Provider value={{ ...providerProps }}>
                    {ui}
                </ContextProvider.Provider>
            </Provider>
        </BrowserRouter>,
        renderOptions
    );
};

export const customRender = (ui, { providerProps, ...renderOptions }) => {
    return render(
        <BrowserRouter>
            <Provider
                store={configureStore({
                    reducer: rootReducer,
                    middleware: (getDefaultMiddleware) =>
                        getDefaultMiddleware({ serializableCheck: false }),
                })}
            >
                {ui}
            </Provider>
        </BrowserRouter>,
        renderOptions
    );
};

export const getComponentByTestId = (id) => {
    return screen.getByTestId(id);
};
