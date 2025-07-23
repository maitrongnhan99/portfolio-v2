# SEO Information Needed

This document lists all the information needed to complete the SEO implementation for your portfolio website. Please fill in the information below, and I'll update the schema accordingly.

## Table of Contents
1. [Personal Information](#personal-information)
2. [Social Media URLs](#social-media-urls)
3. [Education](#education)
4. [Location](#location)
5. [Professional Details](#professional-details)
6. [Website Information](#website-information)
7. [Additional Skills/Technologies](#additional-skillstechnologies)
8. [Optional Enhancements](#optional-enhancements)
9. [Ask Me AI Assistant Page](#ask-me-ai-assistant-page)

## Personal Information

### Profile Photo
- **Current**: `/profile-photo.jpg` (placeholder)
- **Needed**: URL to your professional profile photo
- **Example**: `/mai-trong-nhan-profile.jpg` or a full URL if hosted externally
- **Requirements**: Professional headshot, good quality, square or portrait orientation

### Contact Information
- **Email**: 
  - Current: `your.email@example.com`
  - Needed: Your professional email address
  - Example: `maitrongnhan@gmail.com`

- **Phone** (optional):
  - Current: `+84-XXX-XXX-XXXX`
  - Needed: Your phone number (if you want it public)
  - Example: `+84-123-456-7890`

## Social Media URLs

### LinkedIn
- **Current**: `https://linkedin.com/in/yourusername`
- **Needed**: Your actual LinkedIn profile URL
- **Example**: `https://linkedin.com/in/maitrongnhan`

### Instagram (optional)
- **Current**: `https://instagram.com/yourusername`
- **Needed**: Your Instagram profile URL (remove if not applicable)
- **Example**: `https://instagram.com/maitrongnhan`

### Twitter/X (optional)
- **Needed**: Your Twitter/X profile URL if you have one
- **Example**: `https://twitter.com/maitrongnhan`

## Education

### University
- **Name**: 
  - Current: `Your University`
  - Needed: The name of your university
  - Example: `Ho Chi Minh City University of Technology`

- **Website**:
  - Current: `https://www.university-website.edu`
  - Needed: Your university's official website
  - Example: `https://www.hcmut.edu.vn`

## Location

### City
- **Current**: `Your City`
- **Needed**: Your city name
- **Example**: `Ho Chi Minh City`

### State/Region
- **Current**: `Your State/Region`
- **Needed**: Your state or region (if applicable)
- **Example**: `Ho Chi Minh` or leave empty if not applicable

### Country
- **Current**: `Vietnam`
- **Needed**: Confirm your country
- **Note**: If not Vietnam, please specify

## Professional Details

### Current Employment (optional)
- **Company Name**:
  - Current: `Your Company`
  - Needed: Your current employer (remove section if freelance/unemployed)
  - Example: `Tech Solutions Inc.`

### Job Title
- **Current**: `FullStack Developer`
- **Needed**: Confirm or update your exact job title
- **Examples**: `Senior FullStack Developer`, `Software Engineer`, `Full Stack Web Developer`

## Website Information

### Production URL
- **Current**: `https://maitrongnhan.com`
- **Needed**: Confirm your actual domain name
- **Note**: This will be used for all absolute URLs in the schema

### Site Language
- **Current**: `en-US`
- **Needed**: Confirm the primary language of your site
- **Options**: `en-US` (English - US), `vi-VN` (Vietnamese), etc.

## Additional Skills/Technologies

Current list includes:
- JavaScript, TypeScript, React, Next.js, Node.js, Express
- MongoDB, PostgreSQL, Docker, Kubernetes, AWS
- CI/CD, Git, GraphQL, REST APIs
- Tailwind CSS, Framer Motion, Python, Django
- Machine Learning, Agile Methodologies

**Please add any additional skills or remove any that don't apply.**

## Optional Enhancements

### Certifications
- List any relevant certifications (AWS, Google Cloud, etc.)
- Example: `AWS Certified Developer - Associate`

### Awards/Achievements
- Any notable achievements or awards
- Example: `Winner of XYZ Hackathon 2023`

### Languages Spoken
- Languages you speak professionally
- Example: `Vietnamese (Native), English (Fluent)`

---

## How to Update

Once you've gathered this information:

1. Update the values in `/lib/seo-schemas.ts` with your actual information
2. Update `/constants/profile.ts` with your real social media URLs
3. Add your professional profile photo to the `/public` directory
4. Remove any optional fields that don't apply to you

## Ask Me AI Assistant Page

### AI Assistant Details

#### Preview Image
- **Current**: `/ask-me-preview.png` (placeholder)
- **Needed**: Screenshot or preview image of the AI assistant interface
- **Purpose**: Shows in social media shares and search results
- **Requirements**: 1200x630px recommended for optimal display

#### Launch Date
- **Current**: `2024-01-01` (placeholder)
- **Needed**: Actual date when the AI assistant was launched
- **Example**: `2024-03-15`

#### Version Information
- **Current**: `1.0.0`
- **Needed**: Current version of the AI assistant
- **Update**: As you add features or make improvements

#### Technical Implementation Details (Optional)
- **AI Model**: What AI/LLM technology powers the assistant
- **RAG System**: Brief description of the knowledge base
- **Update Frequency**: How often the knowledge base is updated

### Query Parameter Support

The AI assistant page supports deep linking with query parameters:
- **Format**: `/ask-me?q={search_term_string}`
- **Example**: `/ask-me?q=What%20are%20your%20React%20skills`
- **Purpose**: Allows direct linking to specific questions

This enables:
- Search engines to index specific queries
- Direct sharing of specific questions
- Better user experience from search results

## Notes

- All information marked as "optional" can be removed if not applicable
- Ensure all URLs are correct and accessible
- Use professional information only (this will be public)
- The email will be displayed as `mailto:` link
- Phone numbers are completely optional and can be omitted for privacy