# Go-Halal PWA

A Progressive Web App for browsing halal products and restaurants.

## Recent Improvements

We've implemented several key improvements to enhance the mobile user experience:

### 1. Mobile Responsiveness & UI Robustness
- Added responsive design using viewport units for consistent layout across devices
- Optimized touch targets for better accessibility (44px minimum size)
- Fixed layout issues for different screen sizes and orientations
- Enhanced scrolling performance with GPU acceleration

### 2. Navigation State Preservation
- Maintained scroll position and filter state when navigating back from product details
- Implemented session storage to save and restore search state
- Improved overall navigation flow for a more native-like experience

### 3. Universal Camera Barcode Scanning
- Implemented a modern barcode scanner using the Web Code API with ZXing fallback
- Added support for automatic rear camera detection across all devices
- Created a BarcodeDetector polyfill for cross-browser compatibility
- Added a manual entry fallback option when camera access is denied

### 4. Faster Product Search
- Optimized search with proper 300ms debouncing to prevent API request flooding
- Implemented client-side filtering for immediate results
- Added a caching system for recent searches to reduce server load
- Added request cancellation to prevent race conditions during rapid typing

## Testing the Improvements

To test these improvements:

1. **Responsive Design**: Test the app on different devices or use browser dev tools to simulate various screen sizes.
2. **State Preservation**: Navigate to a product detail and press back - the list should return to the same scroll position.
3. **Barcode Scanning**: Use the scan feature on any product with a barcode - it should detect quickly (< 500ms).
4. **Search Performance**: Type in the search box and observe the response time (should be < 300ms).

## Development

### Install Dependencies
```
yarn install
```

### Start Development Server
```
yarn start
```

### Build for Production
```
yarn build
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`
###  nodemon server.js

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject` 

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
