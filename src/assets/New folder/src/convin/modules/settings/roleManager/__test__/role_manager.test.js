import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { store } from "@store/index"; // Import your Redux store
import RoleManagerList from "../components/RoleManagerList";
import ThemeProvider from "@convin/theme";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { roleManagerApiSlice } from "@convin/redux/services/settings/roleManager.service";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create an MSW server
const server = setupServer();

// Mock the API response for the getRoles endpoint
server.use(
    rest.get("/person/role/", async (req, res, ctx) => {
        // Define the mocked response data
        const mockedData = [
            { id: 1, name: "Role 1", description: "Role 1 description" },
            { id: 2, name: "Role 2", description: "Role 2 description" },
            // Add more mocked data as needed
        ];

        return res(ctx.status(200), ctx.json(mockedData));
    })
);

// Start the server
beforeAll(() => server.listen());

// Reset and stop the server
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Create Role button navigates to the correct page", async () => {
    const history = createMemoryHistory();

    // Create a temporary API client instance for mocking
    const mockApi = createApi({
        reducerPath: "mockApi",
        baseQuery: fetchBaseQuery({ baseUrl: "/" }),
        endpoints: (builder) => ({}),
    });

    // Override the behavior of the useGetRolesQuery hook
    mockApi.injectEndpoints({
        endpoints: (builder) => ({
            getRoles: builder.query({
                query: () => "/person/role/",
                providesTags: ["Role"],
                onQueryStarted: async () => {
                    // Mock the successful response
                    mockApi.endpoints.getRoles.useQueryState.mockReturnValueOnce(
                        {
                            data: [
                                {
                                    id: 1,
                                    name: "Role 1",
                                    description: "Role 1 description",
                                },
                                {
                                    id: 2,
                                    name: "Role 2",
                                    description: "Role 2 description",
                                },
                            ],
                            isLoading: false,
                            isError: false,
                        }
                    );
                },
            }),
        }),
    });

    render(
        <Provider store={store}>
            <Router history={history}>
                <ThemeProvider>
                    <RoleManagerList />
                </ThemeProvider>
            </Router>
        </Provider>
    );

    // Wait for the component to finish loading and render
    await waitFor(() => {
        expect(screen.queryByTestId("page-loader")).not.toBeInTheDocument();
    });

    // Simulate the click on the Create Role button
    fireEvent.click(screen.getByText("Create Role"));

    expect(history.location.pathname).toBe("/create_role");
});
