#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const CURR_DIR = process.cwd();
let CONFIG;

try {
  CONFIG = require(CURR_DIR + '/config/nightwatch.json');
} catch (err) {
  // console.log(err);
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
    message: 'Which component template would you like to generate?',
    choices: CHOICES

  },
  {
    name: 'component-name',
    type: 'input',
    message: 'Component name:',
    when: function (answers) {
      return !(answers['component-choice'] === 'nightwatch.conf.js');
    },
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Component name may only include letters, numbers, underscores and hashes.';
    }
  }
];

let outputDir;

inquirer.prompt(QUESTIONS)
  .then(answers => {
    let componentName;
    const componentChoice = answers['component-choice'];
    const templatePath = `${__dirname}/templates/${componentChoice}`;

    if (componentChoice === "nightwatch.conf.js") {
      componentName = componentChoice;
      outputDir = CURR_DIR;
    } else {
      componentName = answers['component-name'] + (answers['component-name'].substr(-3) === '.js' ? '' : '.js');
      outputDir = PATHS[componentChoice] || `${CURR_DIR}/${componentChoice}`;
    }

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
