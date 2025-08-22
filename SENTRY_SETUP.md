# Sentry Setup Guide

This guide will help you configure Sentry error tracking for the portfolio project.

## Prerequisites

1. Create a Sentry account at [https://sentry.io](https://sentry.io)
2. Create a new project in Sentry (select Next.js as the platform)
3. Obtain your DSN from the project settings

## Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```bash
# Required: Your Sentry DSN (Data Source Name)
# Found in: Sentry Dashboard > Settings > Projects > [Your Project] > Client Keys (DSN)
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_KEY@oXXXXXXX.ingest.sentry.io/XXXXXXX
SENTRY_DSN=https://YOUR_KEY@oXXXXXXX.ingest.sentry.io/XXXXXXX

# Required for source map uploads (production builds)
# Found in: Sentry Dashboard > Settings > Account > API > Auth Tokens
SENTRY_AUTH_TOKEN=sntrys_YOUR_AUTH_TOKEN

# Required: Your organization slug
# Found in: Sentry Dashboard > Settings > Organization Settings
SENTRY_ORG=your-organization-slug

# Required: Your project slug
# Found in: Sentry Dashboard > Settings > Projects > [Your Project]
SENTRY_PROJECT=your-project-slug

# Optional: Release version (defaults to git commit SHA)
SENTRY_RELEASE=1.0.0
NEXT_PUBLIC_SENTRY_RELEASE=1.0.0

# Optional: Environment name
SENTRY_ENVIRONMENT=production
```

### Getting Your Sentry Values

1. **DSN**: 
   - Go to Settings → Projects → Select your project → Client Keys (DSN)
   - Copy the DSN value

2. **Auth Token**:
   - Go to Settings → Account → API → Auth Tokens
   - Click "Create New Token"
   - Give it a name like "portfolio-source-maps"
   - Select scopes: `project:releases`, `org:read`, `project:write`
   - Copy the generated token

3. **Organization Slug**:
   - Go to Settings → Organization Settings
   - Find the "Organization Slug" field

4. **Project Slug**:
   - Go to Settings → Projects → Select your project
   - Find the "Project Slug" field

## Features Configured

### 1. Error Tracking
- Automatic error capture for both client and server-side errors
- Custom error boundaries with Sentry integration
- Filtering of known/expected errors

### 2. Performance Monitoring
- Transaction tracking for page loads and API calls
- Web Vitals monitoring
- Database query performance (MongoDB/Mongoose)

### 3. Session Replay
- Records user sessions when errors occur
- Privacy-focused with text masking enabled
- Helps debug UI issues

### 4. User Feedback
- Widget for users to report issues
- Contextual feedback linked to errors

### 5. Security & Privacy
- Sensitive data scrubbing
- Cookie and auth header redaction
- PII (Personally Identifiable Information) protection

## Testing Sentry Integration

### 1. Test Client-Side Error

Visit `/api/sentry-test-client` or add this button to a page:

```tsx
<button
  onClick={() => {
    throw new Error("Test Sentry Client Error");
  }}
>
  Test Client Error
</button>
```

### 2. Test Server-Side Error

Create or visit `/api/sentry-test-server`:

```typescript
// app/api/sentry-test-server/route.ts
export async function GET() {
  throw new Error("Test Sentry Server Error");
}
```

### 3. Test Edge Runtime Error

Create or visit `/api/sentry-test-edge`:

```typescript
// app/api/sentry-test-edge/route.ts
export const runtime = 'edge';

export async function GET() {
  throw new Error("Test Sentry Edge Error");
}
```

### 4. Verify in Sentry Dashboard

1. Go to your Sentry project dashboard
2. Check the Issues tab for captured errors
3. Check Performance tab for transactions
4. Check Replays tab for session recordings

## Configuration Details

### Sample Rates (Production)

- **Error Sampling**: 100% (all errors are captured)
- **Transaction Sampling**: 10% (performance data)
- **Session Replay**: 10% (normal sessions), 100% (error sessions)
- **Profiles**: 10% (CPU profiling data)

### Development vs Production

In development:
- Higher sampling rates for easier debugging
- Source maps are not uploaded
- More verbose logging

In production:
- Lower sampling rates to control costs
- Source maps are uploaded and then deleted
- Tunneling enabled to bypass ad blockers

## Troubleshooting

### Common Issues

1. **"Sentry not capturing errors"**
   - Check if DSN is correctly set in environment variables
   - Verify the DSN matches your project
   - Check browser console for Sentry initialization errors

2. **"Source maps not working"**
   - Ensure `SENTRY_AUTH_TOKEN` has correct permissions
   - Check build logs for source map upload errors
   - Verify `SENTRY_ORG` and `SENTRY_PROJECT` match exactly

3. **"High Sentry costs"**
   - Reduce sampling rates in production
   - Add more specific error filtering
   - Use `beforeSend` to drop unnecessary events

4. **"CSP Errors"**
   - The CSP headers have been updated to allow Sentry
   - If still seeing issues, check browser console for specific CSP violations

### Debug Mode

To enable debug mode, add to your Sentry config:

```typescript
Sentry.init({
  debug: true,
  // ... other config
});
```

## Monitoring Best Practices

1. **Use Breadcrumbs**: Add custom breadcrumbs for important user actions
2. **Set User Context**: Identify users (without PII) for better debugging
3. **Custom Tags**: Add tags for features, pages, or user segments
4. **Environments**: Use different environments (dev, staging, prod)
5. **Release Tracking**: Tag releases to track error trends

## Cost Management

Sentry pricing is based on event volume. To manage costs:

1. Use appropriate sampling rates
2. Filter out noisy errors
3. Set up quotas and alerts in Sentry
4. Regularly review and archive resolved issues

## Security Considerations

1. Never commit `.env.local` or any file with Sentry tokens
2. Use server-side only for `SENTRY_AUTH_TOKEN`
3. Be careful not to log sensitive user data
4. Review Sentry's data retention policies
5. Consider GDPR/privacy requirements for your users

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Best Practices](https://docs.sentry.io/product/best-practices/)
- [Performance Monitoring Guide](https://docs.sentry.io/product/performance/)
- [Session Replay Documentation](https://docs.sentry.io/product/session-replay/)

## Support

If you encounter issues:

1. Check the [Sentry Status Page](https://status.sentry.io/)
2. Review error logs in your application
3. Consult Sentry's documentation
4. Contact Sentry support for account-specific issues