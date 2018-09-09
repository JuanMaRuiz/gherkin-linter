const assert = require('chai').assert;
const rules = require('../dist/rules');

describe('Rules operations in ', function() {
  describe('isRuleEnabled method in rules file', function () {
    it('should return true if rule is enabled with the string format "custom": "on"', function () {
      const ruleConfiguration = 'on';
      assert.isOk(rules.isRuleEnabled(ruleConfiguration), 'Rule is not enabled');
    });

    it('should return true if rule is enabled via configuration array  "rule": ["on", { "element": ["first_element"] }];', function () {
      const ruleConfiguration = ['on', { 'element': ['first_element'] }];
      assert.isOk(rules.isRuleEnabled(ruleConfiguration), 'Rule is not enabled using configuration array');
    });
  });
});
