const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
var Gherkin = require('gherkin');
var parser = new Gherkin.Parser();
const no_unnamed_feature = require('../../../dist/rules/no-unnamed-features');

describe('No unnamed features rule', function () {

  function getFeatureFileContent(featureFile) {
    const featureContent = fs.readFileSync(path.resolve(__dirname, featureFile), 'UTF-8');
    return parser.parse(featureContent).feature || {};
  }

  it('should return message "Missing Feature name" if no scenario name is provided', () => {
    const feature = getFeatureFileContent('no-unnamed-features-without-name.feature');
    assert(no_unnamed_feature.run(feature).message === 'Missing Feature name', 'Error message is not correct or feature has no name');
  });

  // it('should return no errors (emtpy array) if scenario name is provided', function () {
  //   const feature = '';
  //   assert(no_unnamed_feature.run(feature) === 'null', 'There are errors in the scenario provided');
  // });

});
