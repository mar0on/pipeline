import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';


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
    // Create a new code pipeline
    const pipeline = new CodePipeline(this, 'Pipeline', {
      // Name of the pipeline
      pipelineName: 'MyPipeline',
      // Synthesize the CDK code in the pipeline
      synth: new ShellStep('Synth', {
        // Use GitHub as the source of truth
        input: CodePipelineSource.gitHub('mar0on/pipeline', 'main'),
        // Commands to run during the synthesis step
        // 1. Install the dependencies
        // 2. Build the CDK code
        // 3. Synthesize the CDK code
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
  }
}
