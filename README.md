# Setup Instructions

1. Log into Serverless Dashboard, create a project and set up  Access Roles for secure temporary AWS deployment 

2. run

```
npm install
```

to ensure the following serverless packages for CI/CD are installed:
serverless-plugin-aws-alerts
serverless-plugin-canary-deployments

3. When creating a new Lambda Function that should cohere with Canary Deployment, ensure it contains the pretraffic/posttraffic hooks:

```
      preTrafficHook: preHook
      postTrafficHook: postHook
```

4. Install jest as a dependency (rather than dev dependency) since it will be used in production for pretraffic hooks:

```
npm i jest
```

```
// package.json
"jest": {
    "verbose" : true
}
```

5. 