import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import {
    useGetAuthUserMutation,
    useLoginMutation,
} from "redux/services/auth.service";
// utils

// ----------------------------------------------------------------------

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user } = action.payload;
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
};

const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
    ...initialState,
    method: "jwt",
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
    children: PropTypes.node,
};

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [login] = useLoginMutation();
    const [getAuthUser] = useGetAuthUserMutation();

    useEffect(() => {
        initialize();
    }, []);

    const handleLogin = async ({ email, password }) =>
        login({
            email,
            password,
        })
            .unwrap()
            .then((res) => initialize());

    const initialize = async () => {
        try {
            const tokens = JSON.parse(
                window.localStorage.getItem("authTokens")
            );
            if (tokens?.access) {
                const response = await getAuthUser();
                const user = response.data;
                if (!user) {
                    throw new Error("Invalid User");
                }
                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        isAuthenticated: true,
                        user,
                    },
                });
            } else {
                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (err) {
            dispatch({
                type: "INITIALIZE",
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    };

    //   const register = async (email, password, firstName, lastName) => {
    //     const response = await axios.post('', {
    //       email,
    //       password,
    //       firstName,
    //       lastName,
    //     });
    //     const { accessToken, user } = response.data;

    //     window.localStorage.setItem('accessToken', accessToken);
    //     dispatch({
    //       type: 'REGISTER',
    //       payload: {
    //         user,
    //       },
    //     });
    //   };

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login: handleLogin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
