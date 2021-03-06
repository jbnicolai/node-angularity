//'use strict';
//
//var inquirer      = require('inquirer'),
//    path          = require('path'),
//    fs            = require('fs');
//
//var ideTemplate   = require('ide-template'),
//    webStorm      = require('../../templates/angularity/webStorm');
//
//require('shelljs/global');
//
//function prompt() {
//  var menuPrompt = {
//    type   : 'list',
//    name   : 'choice',
//    choices: ['External Tools', 'File Templates'],
//    message: 'Choose which WebStorm settings to install.',
//    filter : function (value) {
//      return value.toLowerCase();
//    }
//  };
//  function handleMenu(answer) {
//    switch (answer.choice) {
//      case 'external tools':
//        promptExternalTools();
//        break;
//      case 'file templates':
//        promptFileTemplates();
//        break;
//      default:
//        throw new Error('Unrecognised choice: ' + answer.choice)
//    }
//  }
//  inquirer.prompt(menuPrompt, handleMenu);
//}
//
//function promptFileTemplates() {
//  var menuPrompt = {
//    type   : 'list',
//    name   : 'choice',
//    choices: ['es5', 'es6'],
//    message: 'What Javascript version of the File Templates do you want to install?',
//    filter : function (value) {
//      return value.toLowerCase();
//    }
//  };
//
//  function handleMenu(answer) {
//    var templateFolder = webStorm.copyFileTemplates(answer.choice);
//    console.log([
//      '',
//      'Copied file templates to ' + templateFolder,
//      'In WebStorm you will have angularity templates in menu File->New.'
//    ].join('\n'));
//  }
//  inquirer.prompt(menuPrompt, handleMenu);
//}
//
//function promptExternalTools() {
//  var externalToolPath = path.join(ideTemplate.webStorm.userPreferences(), 'tools', 'Angularity.xml');
//  var hasExisting      = fs.existsSync(externalToolPath);
//  var message    = hasExisting ?
//      'You already have an External Tool setup for Angularity.' :
//      'Setup will install External tools for running Angularity in WebStorm.';
//  var choices    = hasExisting ? ['overwrite','cancel'] : ['continue', 'cancel'];
//  var menuPrompt = {
//    type   : 'list',
//    name   : 'choice',
//    choices: choices,
//    message: message,
//    filter : function (value) {
//      return value.toLowerCase();
//    }
//  };
//
//  function handleMenu(answer) {
//    console.log('If you have WebStorm open, please restart it.');
//    switch(answer.choice) {
//      case 'continue':
//        webStorm.generateAngularityWebStormTools();
//        break;
//      case 'overwrite':
//        console.log('overriding exiting Angularity.xml');
//        rm(externalToolPath);
//        webStorm.generateAngularityWebStormTools();
//        console.log([
//          '',
//          'Wrote WebStorm to ' + externalToolPath + '.',
//          'In Webstorm you can launch Angularity builds in menu Tools->Angularity.'
//        ].join('\n'));
//        break;
//      case 'cancel':
//        break;
//      default:
//        throw new Error('Unrecognised choice: ' + answer.choice)
//    }
//  }
//  inquirer.prompt(menuPrompt, handleMenu);
//}
//
//module.exports = {
//  prompt:           prompt
//};