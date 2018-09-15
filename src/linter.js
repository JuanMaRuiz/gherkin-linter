const fs = require('fs');
const _ = require('lodash');
const Gherkin = require('gherkin');
const parser = new Gherkin.Parser();
const rules = require('./rules.js');

function lint(files, configuration, additionalRulesDirs) {
  let output = [];

  files.forEach(function(fileName) {
    let errors = [];
    const fileContent = fs.readFileSync(fileName, 'utf-8');
    const file = {
      name: fileName,
      lines: fileContent.split(/\r\n|\r|\n/)
    };

    try {
      var feature = parser.parse(fileContent).feature || {};
      errors = rules.runAllEnabledRules(feature, file, configuration, additionalRulesDirs);
    } catch(e) {
      if(e.errors) {
        errors = processFatalErrors(e.errors);
      } else {
        throw e;
      }
    }

    output.push({
      filePath: fs.realpathSync(fileName),
      errors: _.sortBy(errors, 'line')
    });
  });

  return output;
}

function processFatalErrors(errors) {
  var errorMsgs = [];
  if (errors.length > 1) {
    var result = getFormatedTaggedBackgroundError(errors);
    errors = result.errors;
    errorMsgs = result.errorMsgs;
  }
  errors.forEach(function(error) {
    errorMsgs.push(getFormattedFatalError(error));
  });
  return errorMsgs;
}

function getFormatedTaggedBackgroundError(errors) {
  var errorMsgs = [];
  var index = 0;
  if (errors[0].message.indexOf('got \'Background') > -1 &&
      errors[1].message.indexOf('expected: #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty') > -1) {

    errorMsgs.push({
      message: 'Tags on Backgrounds are disallowed',
      rule: 'no-tags-on-backgrounds',
      line: errors[0].message.match(/\((\d+):.*/)[1]
    });

    index = 2;
    for(var i = 2; i < errors.length; i++) {
      if (errors[i].message.indexOf('expected: #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty') > -1) {
        index = i;
      } else {
        break;
      }
    }
  }
  return {
    errors: errors.slice(index, errors.length),
    errorMsgs: errorMsgs
  };
}

function getFormattedFatalError(error) {
  var errorLine = error.message.match(/\((\d+):.*/)[1];
  var errorMsg;
  var rule;
  if (error.message.indexOf('got \'Background') > -1) {
    errorMsg = 'Multiple "Background" definitions in the same file are disallowed';
    rule = 'up-to-one-background-per-file';
  } else if(error.message.indexOf('got \'Feature') > -1) {
    errorMsg = 'Multiple "Feature" definitions in the same file are disallowed';
    rule = 'one-feature-per-file';
  } else if (error.message.indexOf('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty, got \'Examples:\'') > -1) {
    errorMsg = 'Cannot use "Examples" in a "Scenario", use a "Scenario Outline" instead';
    rule = 'no-examples-in-scenarios';
  } else if (error.message.indexOf('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty, got') > -1 ||
             error.message.indexOf('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ExamplesLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty, got') > -1) {
    errorMsg = 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are disallowed';
    rule = 'no-multiline-steps';

  } else {
    errorMsg = error.message;
    rule = 'unexpected-error';
  }
  return {message: errorMsg,
    rule   : rule,
    line   : errorLine};
}

module.exports = {
  lint: lint
};
