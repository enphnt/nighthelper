#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const CURR_DIR = process.cwd();
let CONFIG;

console.log(CURR_DIR);
try {
  CONFIG = require(CURR_DIR + '/config/nightwatch.json');
} catch (err) {
  console.log(err);
  CONFIG = {};
}

const PATHS = {
  command: CONFIG.custom_commands_path,
  assertion: CONFIG.custom_assertions_path,
  page: CONFIG.page_objects_path
}

const QUESTIONS = [
  {
    name: 'component-choice',
    type: 'list',
    message: 'What component template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'component-name',
    type: 'input',
    message: 'Component name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Component name may only include letters, numbers, underscores and hashes.';
    }
  }
];
let outputDir;

inquirer.prompt(QUESTIONS)
  .then(answers => {
    const componentChoice = answers['component-choice'];
    const componentName = answers['component-name'] + (answers['component-name'].substr(-3) === '.js' ? '' : '.js');
    const templatePath = `${__dirname}/templates/${componentChoice}`;
    outputDir = PATHS[componentChoice] || `${CURR_DIR}/${componentChoice}s`;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    createDirectoryContents(templatePath, componentName);
  });

function createDirectoryContents (templatePath, newComponentPath) {
  fs.createReadStream(templatePath)
    .pipe(fs.createWriteStream(`${outputDir}/${newComponentPath}`))
    .on('close', function () {
      console.log(`
      Finished.
      Created: ${outputDir}/${newComponentPath}`)
    });
}
