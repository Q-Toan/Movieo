# MovieApp

A web application for browsing and discovering movies and TV shows, built with React and the TMDB API.

## Features

*   Browse trending, now playing, top-rated, and popular movies and TV shows.
*   View detailed information for a specific movie or TV show, including cast, overview, and similar titles.
*   Search for movies and TV shows.
*   Infinite scrolling on the search results page.
*   Responsive design for mobile and desktop.

## Technologies Used

*   [React](https://reactjs.org/)
*   [React Router](https://reactrouter.com/)
*   [Redux Toolkit](https://redux-toolkit.js.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Axios](https://axios-http.com/)
*   [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v14 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/Q-Toan/Movieo.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

### Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

`REACT_APP_ACCESS_TOKEN: eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2M2YwMzU5NjVkYzk4MWYxOTI3YjZlNmNmNTI1OTdmYiIsIm5iZiI6MTc0NzU1NTU0OC44MDcwMDAyLCJzdWIiOiI2ODI5OTRkYzE2MmQyZTI4NThlMjQ4MzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.CEpI_kOKv5g5NcC75mqulmrG3krTDUs4y0FeWwaiILk`

This is your access token for the TMDB API. You can get one by creating an account on the [TMDB website](https://www.themoviedb.org/signup).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\nOpen [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\nYou will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\nIt correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\nYour app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them.