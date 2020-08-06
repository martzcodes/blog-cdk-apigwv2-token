import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { HttpApi, CfnAuthorizer, LambdaProxyIntegration, HttpMethod, CfnRoute } from '@aws-cdk/aws-apigatewayv2';
import { Runtime } from '@aws-cdk/aws-lambda';

export class BlogCdkApigwv2TokenStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const someLambda = new NodejsFunction(this, "someLambdaFunction", {
      entry: `${__dirname}/some-lambda.ts`,
      handler: "handler",
      runtime: Runtime.NODEJS_12_X
    });
    const httpApi = new HttpApi(this, "AuthorizedApi");
    const someIntegration = new LambdaProxyIntegration({
      handler: someLambda,
    });
    const routes = httpApi.addRoutes({
      path: "/",
      methods: [HttpMethod.GET],
      integration: someIntegration,
    });
    const authorizer = new CfnAuthorizer(this, "SomeAuthorizer", {
      apiId: httpApi.httpApiId,
      authorizerType: "JWT", // HAS TO BE JWT FOR HTTP APIs !?!
      identitySource: ["$request.header.Authorization"],
      name: "some-authorizer",
      jwtConfiguration: {
        issuer: "https://martzcodes.us.auth0.com/",
        audience: ["https://martzcodes.us.auth0.com/api/v2/"],
      },
    });
    routes.forEach((route) => {
      const routeCfn = route.node.defaultChild as CfnRoute;
      routeCfn.authorizerId = authorizer.ref;
      routeCfn.authorizationType = "JWT"; // THIS HAS TO MATCH THE AUTHORIZER TYPE ABOVE
    });
  }
}
