// Operations on rules
const fs = require('fs');
const path = require('path');

function getAllRules(additionalRulesDirs) {
  const rules = {};
  const rulesDirs = [
    path.join(__dirname, 'rules')
  ].concat(additionalRulesDirs || []);

  rulesDirs.forEach(function(rulesDir) {
    rulesDir = path.resolve(rulesDir);
    fs.readdirSync(rulesDir).forEach(function(file) {
      var rule = require(path.join(rulesDir, file));
      rules[rule.name] = rule;
    });
  });
  return rules;
}

function getRule(rule, additionalRulesDirs) {
  return getAllRules(additionalRulesDirs)[rule];
}

function doesRuleExist(rule, additionalRulesDirs) {
  return getRule(rule, additionalRulesDirs) !== undefined;
}

/**
 * Checks if a rule is enabled "on". Rules are configured in this way:
 *  Case 1: "rule1" : "on",
 *  Case 2: "rule2" : ["on", {"element": ["first_element"]}]
 *
 * @param {String|Array} ruleConfig
 * @returns {Boolean} - Returns a boolean, true if the rule is configured
 */
function isRuleEnabled(ruleConfig) {
  const ruleConfiguration = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;
  return ruleConfiguration === 'on';
}

function runAllEnabledRules(feature, file, configuration, additionalRulesDirs) {
  var errors = [];
  var ignoreFutureErrors = false;
  var rules = getAllRules(additionalRulesDirs);

  Object.keys(rules).forEach(function(ruleName) {
    var rule = rules[ruleName];
    if (isRuleEnabled(configuration[rule.name]) && !ignoreFutureErrors) {
      var ruleConfig = Array.isArray(configuration[rule.name]) ? configuration[rule.name][1] : {};
      var error = rule.run(feature, file, ruleConfig);

      if (error) {
        if (rule.suppressOtherRules) {
          errors = [error];
          ignoreFutureErrors = true;
        } else {
          errors = errors.concat(error);
        }
      }
    }
  });
  return errors;
}


module.exports = {
  doesRuleExist: doesRuleExist,
  isRuleEnabled: isRuleEnabled,
  runAllEnabledRules: runAllEnabledRules,
  getRule: getRule
};
