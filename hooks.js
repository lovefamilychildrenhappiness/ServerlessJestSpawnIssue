const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});
import * as path from 'path';
import { runCLI } from 'jest';

module.exports.pre = (event, context, callback) => {
  var deploymentId = event.DeploymentId;
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

  const resp = await runCLI({ testMatch: ['<rootDir>/spec/integration/hello/*.test.js'] }, ['/var/task']);

  const result = resp.results.testResults.filter( (result) => path.basename(result.testFilePath) === 'index.test.js' );

  const success = result.every( test => test.numFailingTests === 0);

  const validationTestResult = success === true ? 'Succeeded' : 'Failed';

  console.log('the validationTestResult: ', validationTestResult)

  var params = {
      deploymentId: deploymentId,
      lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
      status: validationTestResult // status can be 'Succeeded' or 'Failed'
  };

  return codedeploy.putLifecycleEventHookExecutionStatus(params).promise()
    .then(data => callback(null, 'Validation test succeeded'))
    .catch(err => callback('Validation test failed'));
};

module.exports.post = (event, context, callback) => {
  var deploymentId = event.DeploymentId;
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

  console.log('Check some stuff after traffic has been shifted...');

  var params = {
      deploymentId: deploymentId,
      lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
      status: 'Succeeded' // status can be 'Succeeded' or 'Failed'
  };

  return codedeploy.putLifecycleEventHookExecutionStatus(params).promise()
    .then(data => callback(null, 'Validation test succeeded'))
    .catch(err => callback('Validation test failed'));
};
