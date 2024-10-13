import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://1b1f0b852a2201a16198ba9a07e169d7@o4508116889698304.ingest.de.sentry.io/4508116891074640',
  tracesSampleRate: 1,
  debug: false,
});
