import * as cdk from 'aws-cdk-lib';
import {SecretValue} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Role, ServicePrincipal, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam'; // Import the Role class



export class PipelineStack extends cdk.Stack {
  /**
   * This stack creates a code pipeline that uses GitHub as the source of truth,
   * and synthesizes the CDK code in the pipeline.
   *
   * @param scope - The parent construct
   * @param id - The construct's name
   * @param props - The stack's properties
   */
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const roleCodePipelineCdk = new Role(this, 'CodePipelineRole', {
      assumedBy: new ServicePrincipal('codepipeline.amazonaws.com'),
    });
    roleCodePipelineCdk.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          's3:GetObject',
          's3:GetObjectVersion',
          's3:GetBucketVersioning',
          's3:PutObject',
          'secretsmanager:GetSecretValue',
          'pipeline:StartPipelineExecution',
          'sts:AssumeRole',	
        ],
        resources: ['*'],
      })
    )

    console.log(SecretValue.secretsManager('github-token',{
      jsonField: 'github-token'})
    )
    // Create a new code pipeline
    const pipeline = new CodePipeline(this, 'Pipeline', {
      role: roleCodePipelineCdk,
      // Name of the pipeline
      pipelineName: 'MyPipeline',
      // Synthesize the CDK code in the pipeline
      synth: new ShellStep('Synth', {
        // Use GitHub as the source of truth
        input: CodePipelineSource.gitHub('mar0on/pipeline', 'main',{
          authentication: SecretValue.secretsManager('github-token',{
            jsonField: 'github-token'})
          }
        ),
        // Commands to run during the synthesis step
        // 1. Install the dependencies
        // 2. Build the CDK code
        // 3. Synthesize the CDK code
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
  }}
