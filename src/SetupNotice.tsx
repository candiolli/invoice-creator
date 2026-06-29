export function SetupNotice() {
  return (
    <div className="setup">
      <div className="setup__card">
        <h1>Backend not configured</h1>
        <p>
          This app needs <code>amplify_outputs.json</code> to talk to AWS. The
          file is generated automatically once you start an Amplify sandbox.
        </p>
        <h2>One-time setup</h2>
        <ol>
          <li>
            Create AWS credentials and put them at <code>~/.aws/credentials</code>{" "}
            (or set <code>AWS_ACCESS_KEY_ID</code> / <code>AWS_SECRET_ACCESS_KEY</code>{" "}
            env vars).
          </li>
          <li>
            From this project root, run: <pre><code>npx ampx sandbox</code></pre>
          </li>
          <li>
            Leave it running. It will create <code>amplify_outputs.json</code>{" "}
            and provision a Cognito user pool + DynamoDB invoice table in{" "}
            <code>us-east-1</code>. Refresh this page after the first deploy
            completes.
          </li>
        </ol>
        <p className="setup__muted">
          You can stop the sandbox with <code>Ctrl+C</code>. To wipe it,{" "}
          <code>npx ampx sandbox delete</code>.
        </p>
      </div>
    </div>
  );
}
