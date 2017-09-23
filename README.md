Requires Node.js to build the project and npm to install dependencies.  
The project has been developed using Node v8.0.0. During development `yarn` was used instead of `npm`.

Setup
Install project dependencies (if you experience issues with missing dependencies try yarn instead `npm install -g yarn` and `yarn install`)  
`npm install`

The development server can be started with the command  
`npm run start`

A production build can be built with the command. This builds files to js/build/.  
`npm run build`

To move files to the Django static files directory run.  
`npm run copyAssets`

Tests, once implemented, can be run with the command  
`npm run test`

Note: production build includes the Redux developer tooling which will need to be disabled for production.

References:
The app structure was generated with [create-react-app](https://github.com/facebookincubator/create-react-app)


