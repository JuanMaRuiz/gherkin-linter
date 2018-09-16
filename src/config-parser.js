var fs = require('fs');
var verifyConfig = require('./config-verifier.js');
var logger = require('./logger.js');
var defaultConfigFileName = '.gherkin-lintrc';

function getConfigurationFile(configFilePath) {
  let configurationFile = configFilePath;
  if (configFilePath) {
    if (!fs.existsSync(configFilePath)) {
      logger.boldError(`Could not find specified config file ${configFilePath}`);
      process.exit(1);
    }
  } else {
    if (!fs.existsSync(defaultConfigFileName)) {
      logger.boldError(`Could not find default config file '${defaultConfigFileName}' in the working directory.
To use a custom name/path provide the config file using the "-c" arg.`);
      process.exit(1);
    }
    configurationFile = defaultConfigFileName;
  }

  return configurationFile;
}

function getConfiguration(configPath, additionalRulesDirs) {
  const configurationFile = getConfigurationFile(configPath);
  var config = JSON.parse(fs.readFileSync(configurationFile));
  var errors = verifyConfig(config, additionalRulesDirs);

  if (errors.length > 0) {
    logger.boldError('Error(s) in configuration file:');
    errors.forEach(function(error) {
      logger.error(`- ${error}`);
    });
    process.exit(1);
  }

  return config;
}

module.exports = {
  getConfiguration: getConfiguration,
  defaultConfigFileName: defaultConfigFileName
};
