import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'cleanup expired rate-limit buckets',
  { hours: 1 },
  internal.rateLimits.cleanupExpired,
  {},
);

export default crons;
