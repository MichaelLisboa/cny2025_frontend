// gatsby-node.js
exports.onCreateWebpackConfig = ({ actions, stage }) => {
    if (stage === 'build-javascript') {
        console.log('Building JavaScript', stage, actions);
        actions.setWebpackConfig({
            devtool: 'source-map',
        });
    }
};