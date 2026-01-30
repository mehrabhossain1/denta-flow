import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: "https://efa147d1d995a2d60df91424c9db01dc@o4510378804969472.ingest.us.sentry.io/4510378811654144",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});