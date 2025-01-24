exports.onCreateWebpackConfig = ({ actions, stage }) => {
    console.log('onCreateWebpackConfig called with stage:', stage);
    if (stage === 'build-javascript') {
        console.log('Building JavaScript', stage);
        actions.setWebpackConfig({
            devtool: 'source-map',
        });
        console.log('Webpack config set with source-map for build-javascript stage');
    }
};