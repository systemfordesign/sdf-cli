#!/usr/bin/env node
/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2018-11-24 01:49:46
 * @LastEditTime: 2019-08-23 16:43:08
 * @LastEditors: Devin Shi
 * @Description: 
 */
const program = require('commander');
const execa = require('execa');
const Listr = require('listr');
const {Observable} = require('rxjs');
const fs = require("fs");
const inquirer = require('inquirer');
const util = require('./util')
const userHome = require('user-home');
const package = require('../package.json')

program
  .version(package.version)
  .usage('<command> [option]')


program
  .command('create [entry]')
  .description('init project with sdf-cli')
  .option('-l, --lang [value]', 'create project by js or ts, default js', 'js')
  .action((name, cmd) => {
    require(`./lib/${cmd._name}`)(name, cmd.lang, program)
  })
  
program
  .parse(process.argv);

if (!program.args || !program.args.length) {
  program.help();
  return;
}