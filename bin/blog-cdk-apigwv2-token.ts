#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BlogCdkApigwv2TokenStack } from '../lib/blog-cdk-apigwv2-token-stack';

const app = new cdk.App();
new BlogCdkApigwv2TokenStack(app, 'BlogCdkApigwv2TokenStack');
