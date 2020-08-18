#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { PipeStack } from '../lib/pipe-stack';

const app = new cdk.App();
new PipeStack(app, 'PipeStack');
