# Cloud Storage Setup Guide

This document explains how to configure cloud storage for your Payload CMS implementation.

## AWS S3 Configuration

### Prerequisites

1. AWS Account with S3 access
2. S3 bucket created
3. IAM user with appropriate S3 permissions

### Step 1: Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://your-portfolio-bucket --region us-east-1
```

Or create through AWS Console:

1. Go to AWS S3 Console
2. Click "Create bucket"
3. Enter bucket name (e.g., `your-portfolio-bucket`)
4. Choose region (e.g., `us-east-1`)
5. Configure settings as needed
6. Click "Create bucket"

### Step 2: Create IAM User and Policy

Create an IAM policy with the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:GetObjectAcl",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::your-portfolio-bucket/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::your-portfolio-bucket"
        }
    ]
}
```

### Step 3: Configure Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Cloud Storage (AWS S3)
S3_BUCKET=your-portfolio-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-aws-access-key-id
S3_SECRET_ACCESS_KEY=your-aws-secret-access-key
```

### Step 4: Update Bucket CORS Policy (if needed)

If you plan to upload files directly from the browser, configure CORS:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

## Alternative: Google Cloud Storage

1. Google Cloud Account
2. Google Cloud Storage bucket
3. Service account with appropriate permissions

### Step 1: Create GCS Bucket

```bash
# Using gcloud CLI
gsutil mb gs://your-portfolio-bucket
```

### Step 2: Configure Service Account

1. Go to Google Cloud Console
2. Navigate to IAM & Admin > Service Accounts
3. Create new service account
4. Add roles: Storage Object Admin
5. Generate and download JSON key file

### Step 3: Environment Variables for GCS

```bash
# Google Cloud Storage
GCS_BUCKET=your-portfolio-bucket
GCS_PROJECT_ID=your-project-id
GCS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 4: Update Payload Config for GCS

Replace the S3 storage plugin in `payload.config.ts` with:

```typescript
import { gcsStorage } from '@payloadcms/storage-gcs'

// In plugins array
gcsStorage({
  collections: {
    media: {
      prefix: 'media',
    },
  },
  bucket: process.env.GCS_BUCKET!,
  options: {
    projectId: process.env.GCS_PROJECT_ID!,
    keyFilename: './path-to-service-account-key.json', // or use client_email and private_key
  },
})
```

## Testing Cloud Storage

### 1. Test Upload Functionality

1. Start your development server: `pnpm dev`
2. Navigate to `/admin`
3. Log in with admin credentials
4. Go to Media collection
5. Try uploading an image
6. Verify the image appears in your cloud storage bucket

### 2. Test Image Access

1. Check that uploaded images are accessible via their URLs
2. Verify different image sizes are generated correctly
3. Test image deletion functionality

## Troubleshooting

### Common Issues

#### S3 Access Denied

- Verify IAM user has correct permissions
- Check bucket policy allows your operations
- Ensure region is correctly specified

#### Images Not Loading

- Check CORS configuration
- Verify bucket is publicly readable (for public images)
- Confirm environment variables are set correctly

#### Upload Failures

- Check file size limits
- Verify MIME type restrictions in Payload config
- Review server logs for specific error messages

### Debug Commands

```bash
# Test AWS credentials
aws sts get-caller-identity

# List S3 buckets
aws s3 ls

# Test bucket access
aws s3 ls s3://your-portfolio-bucket
```

## Security Considerations

### Production Setup

1. **Use separate buckets for different environments** (dev, staging, prod)
2. **Implement proper IAM roles** with minimum required permissions
3. **Enable versioning** on your S3 bucket for backup purposes
4. **Set up lifecycle policies** to manage storage costs
5. **Enable CloudFront** for better performance and caching

### Environment Variables Security

- Never commit `.env` files to version control
- Use secure secret management in production (AWS Secrets Manager, etc.)
- Rotate access keys regularly
- Monitor access logs for suspicious activity

## Cost Optimization

### S3 Storage Classes

- Use Standard for frequently accessed images
- Consider Standard-IA for less frequently accessed content
- Set up lifecycle rules to transition to cheaper storage classes

### CloudFront Integration

```typescript
// Example CloudFront URL transformation
const transformImageUrl = (url: string) => {
  if (url.includes('s3.amazonaws.com')) {
    return url.replace('s3.amazonaws.com', 'your-cloudfront-domain.cloudfront.net')
  }
  return url
}
```

## Monitoring and Maintenance

### Regular Tasks

1. Monitor storage usage and costs
2. Review access logs for security
3. Test backup and restore procedures
4. Update access keys periodically
5. Review and update bucket policies

### Automation Scripts

Consider creating scripts for:

- Bulk image optimization
- Backup verification
- Cost reporting
- Access log analysis

---

## Next Steps

1. Choose your preferred cloud storage provider
2. Set up the bucket and credentials
3. Configure environment variables
4. Test upload functionality
5. Configure CDN if needed
6. Set up monitoring and alerts

For any issues, refer to the official documentation:

- [Payload Cloud Storage Plugin](https://payloadcms.com/docs/upload/cloud-storage)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
