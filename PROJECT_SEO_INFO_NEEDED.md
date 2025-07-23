# Project Page SEO Information Needed

This document lists all the optional information that can enhance SEO for individual project pages. The schema implementation is complete, but adding this information will improve search engine visibility and rich snippets.

## Per-Project Information

For each project in `/lib/projects-data.ts`, you can add the following optional fields:

### Software Details

#### Operating System
- **Current**: Default to "Windows, macOS, Linux"
- **Needed**: Specific OS requirements for each project
- **Examples**: 
  - Web apps: "Cross-platform (Any modern browser)"
  - Desktop apps: "Windows 10+, macOS 10.15+"
  - Mobile apps: "iOS 14+, Android 8+"

#### Version Information
- **Field**: `version`
- **Example**: "1.0.0", "2.3.1", "0.9-beta"
- **Purpose**: Shows software maturity and update history

#### File Size (if downloadable)
- **Field**: `fileSize`
- **Example**: "25MB", "1.2GB"
- **Purpose**: For downloadable applications

#### Download URL
- **Field**: `downloadUrl`
- **Example**: "https://github.com/user/project/releases/latest"
- **Purpose**: Direct download link for installable software

#### System Requirements
- **Field**: `requirements`
- **Example**: "Node.js 16+, npm 7+, 4GB RAM minimum"
- **Purpose**: Technical requirements to run the software

### Pricing Information (if applicable)

#### Price
- **Field**: `price`
- **Example**: "49.99", "0" (for free), "9.99"
- **Purpose**: If you sell any projects or have paid versions

#### Currency
- **Field**: `priceCurrency`
- **Example**: "USD", "EUR", "VND"
- **Default**: "USD"

### User Ratings (if available)

#### Rating Object
- **Field**: `rating`
- **Structure**:
  ```typescript
  rating: {
    value: "4.8",  // Average rating
    count: "152"   // Number of reviews
  }
  ```
- **Purpose**: Shows social proof and user satisfaction

### Application Categories

Current category mapping:
- FullStack → WebApplication
- Frontend → WebApplication
- Backend → ServerApplication
- Mobile → MobileApplication
- Desktop → DesktopApplication

You can add more specific categories like:
- API → WebAPI
- Library → SoftwareLibrary
- Tool → UtilitiesApplication
- Game → GameApplication
- Education → EducationalApplication

### Enhanced Project Data Example

```typescript
{
  id: 1,
  title: "Task Management App",
  slug: "task-management-app",
  description: "A full-featured task management application...",
  longDescription: "Detailed description...",
  image: "/projects/task-app-main.png",
  category: "FullStack",
  technologies: ["React", "Node.js", "MongoDB"],
  features: [...],
  challenges: "...",
  date: "2023-10-01",
  liveUrl: "https://tasks.example.com",
  githubUrl: "https://github.com/user/task-app",
  gallery: [...],
  
  // NEW SEO FIELDS:
  version: "2.1.0",
  operatingSystem: "Cross-platform (Any modern browser)",
  requirements: "Modern browser with JavaScript enabled",
  
  // If it's a paid product:
  price: "19.99",
  priceCurrency: "USD",
  
  // If you have user ratings:
  rating: {
    value: "4.7",
    count: "89"
  },
  
  // If downloadable:
  downloadUrl: "https://github.com/user/task-app/releases",
  fileSize: "15MB",
}
```

## Global SEO Enhancements

### License Information
Consider adding license information to each project:
- **Field**: `license`
- **Examples**: "MIT", "GPL-3.0", "Apache-2.0", "Proprietary"

### Update Frequency
- **Field**: `updateFrequency`
- **Examples**: "Monthly", "Quarterly", "As needed"

### Support Information
- **Field**: `supportUrl`
- **Example**: "https://github.com/user/project/issues"

### Documentation
- **Field**: `documentationUrl`
- **Example**: "https://docs.example.com/project"

## Implementation Notes

1. All fields are optional - only add what's relevant
2. For web applications, use "Cross-platform" for operating system
3. Ratings should only be added if you have actual user reviews
4. Prices should only be added for commercial projects
5. Keep version numbers updated as you release new versions

## Benefits of Adding This Information

- **Rich Snippets**: Google may show ratings, prices, and other details in search results
- **Better Categorization**: Helps search engines understand your projects better
- **User Trust**: Version numbers and requirements build confidence
- **Competitive Advantage**: Complete information ranks better than incomplete listings

## How to Update

1. Edit `/lib/projects-data.ts`
2. Add any relevant fields to each project object
3. The schema will automatically pick up these fields
4. Test with Google's Rich Results Test tool

Remember: Quality over quantity - only add information that's accurate and helpful to users.