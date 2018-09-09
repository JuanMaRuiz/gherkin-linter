const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
var Gherkin = require('gherkin');
var parser = new Gherkin.Parser();
const no_unnamed_scenario = require('../../../dist/rules/no-unnamed-scenarios');

describe('No unnamed scecnarios rule', function () {

  function setUp(featureFile) {
    const featureContent = fs.readFileSync(path.resolve(__dirname, featureFile), 'UTF-8');
    return parser.parse(featureContent).feature || {};
  }

  it('should return message "Missing Scenario name" if no scenario name is provided', () => {
    const feature = setUp('no-unnamed-scenarios-rule-with-no-name.feature');
    assert(no_unnamed_scenario.run(feature)[0].message === 'Missing Scenario name', 'Error message is not correct or doesn\'t exists');
  });

  it('should return no errors (emtpy array) if scenario name is provided', function () {
    const feature = setUp('no-unnamed-scenarios-rule-with-name.feature');
    assert(no_unnamed_scenario.run(feature).length === 0, 'There are errors in the scenario provided');
  });

});
