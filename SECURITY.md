# Security Policy

## Recent Security Fixes (2025-07-24)

### Critical Issues Resolved

1. **Environment Variable Exposure** - Removed `TELEGRAM_BOT_TOKEN` from client-side environment variables
2. **Build Error Suppression** - Removed `ignoreDuringBuilds` and `ignoreBuildErrors` to catch potential issues
3. **Security Headers** - Added comprehensive security headers including CSP, XSS protection, and frame options

### Security Headers Implemented

- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME type sniffing)
- **X-XSS-Protection**: 1; mode=block (enables XSS filtering)
- **Referrer-Policy**: origin-when-cross-origin (controls referrer information)
- **Permissions-Policy**: Restricts camera, microphone, and geolocation access
- **Content-Security-Policy**: Comprehensive CSP with minimal required permissions

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email the maintainer directly at [your-email]
3. Include detailed information about the vulnerability
4. Allow reasonable time for response and fix

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Implementation**: Within 2 weeks for critical issues
- **Public Disclosure**: After fix is deployed and tested

## Security Best Practices

### Environment Variables
- Never expose sensitive tokens to client-side
- Use server-side API routes for sensitive operations
- Regularly rotate API keys and tokens

### Dependencies
- Run `npm audit` regularly
- Keep dependencies updated
- Review security advisories for used packages

### API Security
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
- Implement proper authentication and authorization
