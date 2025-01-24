exports.onCreateWebpackConfig = ({ actions, stage }) => {
    if (stage === 'build-javascript') {
      actions.setWebpackConfig({
        devtool: 'source-map',
      });
    }
  };