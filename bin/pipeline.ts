#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodebuildStack } from '../lib/codebuild-stack';

const app = new cdk.App();
new CodebuildStack(app, 'PipelineStack', {
  env: {
    account: '060795898657',
    region: 'eu-central-1',
  }
});

app.synth();