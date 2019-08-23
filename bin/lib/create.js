/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-23 16:34:10
 * @LastEditTime: 2019-08-23 16:42:16
 * @LastEditors: Devin Shi
 * @Description: 
 */
const execa = require('execa');
const Listr = require('listr');
const {Observable} = require('rxjs');
const fs = require("fs");
const inquirer = require('inquirer');
const util = require('../util')
const userHome = require('user-home');

module.exports = (projectName, lang, program) => {

  if (!projectName) {
    program.help()
    return
  }

  const repoName = lang === 'ts' ? 'sdf-ts-vue-starter' : 'sdf-vue-starter'

  const templatePath = `${userHome}/.sdf-template`;
  const templateGitRepoOrg = 'systemfordesign'

  const promptList = [{
    type: 'list',
    message: `current path ${projectName} exists , please choice type to use`,
    name: 'mergeFunction',
    choices: [
      "overwrite",
      "none"
    ],
    when: function(answer) {
      const fileExist = fs.existsSync(projectName)
      return fileExist
    }
  }]
  
  inquirer.prompt(promptList).then(answer => {
  
    if ('overwrite' === answer.mergeFunction) {
      if (fs.existsSync(projectName)) {
        util.delDir(projectName) 
      }
    } else if ('none' === answer.mergeFunction){
      console.log('create over')    
      return ;
    }
  
    tasks.run().catch(err => {
      console.error(err);
    });
  
  })
  
  
  const updateGitHubRepo = {
    title: `update cache ${repoName} from git repo`,
    task: () => {
      if (!fs.existsSync(templatePath)) {
        fs.mkdirSync(templatePath)
      }
      if (fs.existsSync(`${templatePath}/${repoName}`)) {
        util.delDir(`${templatePath}/${repoName}`)
      }
      return execa('git', ['clone', `https://github.com/${templateGitRepoOrg}/${repoName}.git`, `${templatePath}/${repoName}`])
        .catch(() => {  
          task.skip('update git repo fail, use local cache')
        })
    }
  }
  
  const runVueCli = {
    title: `run vue cli create project to ${repoName}`,
    task: () => {
      return execa('vue', ['create', '--preset', `${templatePath}/${repoName}`, projectName])
              .then(res => {
                console.log(res.all)
              })
    }
  }
  
  const tasks = new Listr([
    updateGitHubRepo,
    runVueCli
  ]);  
}