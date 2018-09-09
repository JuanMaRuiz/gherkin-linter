const RULE = 'no-unnamed-scenarios';

function noUnNamedScenarios(feature) {

  if (feature.children) {
    var errors = [];
    feature.children.forEach(function(scenario) {
      if (!scenario.name && scenario.type === 'Scenario') {
        errors.push({
          message: 'Missing Scenario name',
          rule   : RULE,
          line   : scenario.location.line
        });
      }
    });
    return errors;
  }
}

module.exports = {
  name: RULE,
  run: noUnNamedScenarios
};
