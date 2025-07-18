# PRP: Resume Page Feature

## Project Overview
Create a professional resume page that displays Mai Trọng Nhân's resume in a web format and allows users to download it as a PDF file.

## Objectives
1. Create a dedicated resume page route (/resume)
2. Display resume content in a professional, readable format
3. Implement PDF download functionality
4. Follow resume best practices and ATS-friendly formatting
5. Ensure responsive design for all devices
6. Maintain consistency with portfolio design system

## Technical Requirements

### 1. Page Structure
- **Route**: `/resume` (Next.js App Router)
- **Layout**: Full-page layout with navigation back to portfolio
- **SEO**: Proper metadata for search engines

### 2. Resume Content Structure
Following developer-friendly markdown CV best practices:

```typescript
interface ResumeData {
  // Header Section
  personalInfo: {
    name: string;
    title: string;  // Optional tagline
    contacts: {
      email: string;
      location: string;  // e.g., "HCMC, Vietnam"
    };
    links: {
      linkedin: string;
      github: string;
      portfolio: string;
    };
  };
  
  // 🧑‍💻 Summary Section
  summary: {
    content: string;  // 2-3 lines max
    yearsOfExperience: number;
    coreSkills: string[];  // Top 3-4 skills
    goal?: string;  // What you're seeking
  };
  
  // 🛠️ Tech Stack Section
  techStack: {
    languages: string[];
    frontend: string[];
    backend: string[];
    database: string[];
    devOps: string[];
    testing: string[];
    other?: string[];  // Additional categories as needed
  };
  
  // 🏢 Experience Section
  experience: Array<{
    position: string;
    company: string;
    location: string;
    duration: string;  // e.g., "May 2023 – Present"
    current?: boolean;
    bullets: Array<{
      description: string;
      impact?: string;  // Quantified results (e.g., "32%")
      technologies?: string[];  // Tech used for this achievement
    }>;
  }>;
  
  // 📂 Projects Section
  projects: Array<{
    name: string;
    emoji?: string;  // Optional emoji for visual appeal
    description: string;
    technologies: string[];
    links: {
      github?: string;
      live?: string;
      npm?: string;
    };
  }>;
  
  // 📜 Education Section
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    duration: string;  // e.g., "2017–2021"
    gpa?: string;
    honors?: string[];
  }>;
  
  // 🧾 Certifications Section (Optional)
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;  // Year only
    credentialId?: string;
    link?: string;
  }>;
  
  // 🧰 Languages Section
  languages: Array<{
    language: string;
    proficiency: string;  // e.g., "Native", "Professional working proficiency"
    certification?: string;  // e.g., "IELTS 7.5"
  }>;
}

// Markdown CV Best Practices
interface ResumeBestPractices {
  structure: {
    useEmojis: boolean;  // For section headers
    markdownFormatting: boolean;  // Bold, links, etc.
    reverseChronological: boolean;  // Most recent first
  };
  
  content: {
    actionVerbs: string[];  // Start bullets with these
    quantifyResults: boolean;  // Include metrics
    tailorToRole: boolean;  // Match job keywords
    conciseBullets: boolean;  // 1-2 lines max
  };
  
  format: {
    pageLimit: number;  // 1-2 pages
    atsCompatible: boolean;  // Simple formatting
    developerReadable: boolean;  // Clean markdown
    exportToPdf: boolean;  // Via pandoc or similar
  };
}
```

### 3. Markdown CV Structure Template

The resume will follow this exact structure:

```markdown
# Mai Trọng Nhân
[LinkedIn](https://linkedin.com/in/maitrongnhan) • [GitHub](https://github.com/maitrongnhan99) • [Portfolio](https://maitrongnhan.dev)  
📧 maitrongnhan.dev@gmail.com • 📍 HCMC, Vietnam

---

## 🧑‍💻 Summary
Fullstack Developer with X+ years of experience building scalable web applications using React, Next.js, and Node.js. Proven ability to deliver high-quality, maintainable code in fast-paced environments. Seeking to contribute to impactful projects in innovative tech companies.

---

## 🛠️ Tech Stack
- **Languages:** JavaScript, TypeScript, Python
- **Frontend:** React, Next.js, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js, GraphQL
- **Database:** MongoDB, PostgreSQL
- **DevOps:** Docker, GitHub Actions, Vercel, AWS
- **Testing:** Jest, Cypress, Vitest

---

## 🏢 Experience

### Position Title — Company Name *(Location)*
**Duration**
- Achievement with **quantified impact** using **technology**.
- Built/Developed feature using **React**, **Next.js**, and **TypeScript**.
- Improved performance by **X%** through optimization techniques.
- Collaborated with cross-functional teams to deliver features.

---

## 📂 Projects

### 🚀 Project Name [GitHub](https://github.com/link)
Description of the project showing technical ownership and impact.

### 🎨 Another Project [Live Demo](https://demo.com)
Brief description highlighting the technologies used and achievements.

---

## 📜 Education

**Bachelor of Science in Computer Science**  
University Name — *Duration*

---

## 🧾 Certifications
- **Certification Name** — Issuer, Year
- **Another Certification** — Issuer, Year

---

## 🧰 Languages
- Vietnamese: Native
- English: Professional working proficiency (Certification if applicable)
```

### 4. Component Architecture

```
app/
  resume/
    page.tsx              # Main resume page
    layout.tsx            # Resume-specific layout
    
components/
  common/
    resume/
      index.ts            # Export barrel
      resume-header.tsx   # Personal info & links section
      resume-summary.tsx  # 🧑‍💻 Summary section
      resume-tech-stack.tsx # 🛠️ Tech Stack section
      resume-experience.tsx # 🏢 Experience section
      resume-projects.tsx # 📂 Projects section
      resume-education.tsx # 📜 Education section
      resume-certifications.tsx # 🧾 Certifications section
      resume-languages.tsx # 🧰 Languages section
      resume-download.tsx # PDF download button
      resume-section.tsx  # Reusable section wrapper with emoji
      
lib/
  resume-data.ts         # Resume content data (following markdown structure)
  pdf-generator.ts       # PDF generation logic
  resume-utils.ts        # Utility functions (action verbs, formatting)
```

### 4. PDF Generation Options

#### Option A: React-PDF (Recommended)
- Use `@react-pdf/renderer` for generating PDFs
- Pros: Full control over styling, consistent output
- Cons: Need to define separate PDF templates

#### Option B: HTML to PDF
- Use libraries like `html2pdf.js` or `puppeteer`
- Pros: Reuse existing HTML/CSS
- Cons: May have styling inconsistencies

#### Option C: Pre-generated PDF
- Store a static PDF file
- Pros: Simple implementation
- Cons: Manual updates required

### 5. Design Requirements

#### Layout Principles
1. **Clean & Professional**: Minimal design, focus on content
2. **ATS-Friendly**: Simple formatting, standard fonts
3. **Scannable**: Clear hierarchy, bullet points
4. **Consistent**: Match portfolio color scheme where appropriate

#### Typography
- **Headings**: Inter or system fonts
- **Body**: Clean, readable font (14-16px web, 10-12pt PDF)
- **Line Height**: 1.5-1.6 for readability

#### Color Scheme
- **Primary**: Portfolio accent color for headings
- **Text**: High contrast (navy on white)
- **Borders**: Subtle dividers between sections

### 6. Features to Implement

#### Core Features
1. **Responsive Resume Display**
   - Mobile-optimized layout
   - Print-friendly CSS
   - Proper spacing and margins

2. **PDF Download**
   - One-click download button
   - Consistent formatting in PDF
   - Proper file naming (e.g., "Mai_Trong_Nhan_Resume_2025.pdf")

3. **Navigation**
   - Back to portfolio button
   - Sticky header with download button
   - Smooth scroll to sections

#### Enhanced Features
1. **Theme Toggle**: Light/dark mode for web view
2. **Copy Contact Info**: Click to copy email/phone
3. **External Links**: GitHub, LinkedIn with icons
4. **Version Date**: Last updated timestamp

### 7. Implementation Steps

#### Phase 1: Setup & Structure
1. Create resume route and layout
2. Define resume data structure
3. Create base components

#### Phase 2: Content Display
1. Implement all resume sections
2. Add responsive styling
3. Ensure print-friendly layout

#### Phase 3: PDF Generation
1. Set up PDF generation library
2. Create PDF template
3. Implement download functionality

#### Phase 4: Polish & Optimize
1. Add animations and interactions
2. Optimize for performance
3. Test on multiple devices

### 8. Resume Best Practices (Following Markdown CV Structure)

#### Content Guidelines
1. **Quantify Achievements**: Use numbers and metrics (e.g., "Improved performance by **32%**")
2. **Action Verbs**: Start bullets with strong verbs (Developed, Built, Improved, Integrated)
3. **Relevant Keywords**: Include industry terms for ATS parsing
4. **Concise Writing**: 1-2 lines per bullet point max
5. **Reverse Chronological**: Most recent first
6. **Use Emojis**: For section headers (🧑‍💻, 🛠️, 🏢, 📂, 📜, 🧾, 🧰)

#### Markdown CV Formatting Rules
1. **Developer-Readable**: Clean markdown structure
2. **One Page**: Keep to single page if possible (1-2 pages max)
3. **White Space**: Adequate margins and spacing
4. **Consistent Format**: Same style throughout
5. **No Fancy Fonts**: For ATS compatibility
6. **Standard Sections**: Expected resume sections with emoji headers
7. **Exportable**: Can be exported to PDF via pandoc or similar tools

#### Section-Specific Best Practices
- **Summary**: 2-3 lines highlighting years of experience, core skills, and goals
- **Tech Stack**: Organized by categories (Languages, Frontend, Backend, etc.)
- **Experience**: Action + impact format with specific technologies used
- **Projects**: Show ownership and technical depth
- **Education**: Simple format with institution and dates
- **Certifications**: Optional but useful for junior-mid level roles
- **Languages**: Include proficiency levels and certifications if available

### 9. Testing Checklist
- [ ] Resume displays correctly on all screen sizes
- [ ] PDF downloads with proper formatting
- [ ] All links work correctly (LinkedIn, GitHub, Portfolio)
- [ ] Content is accurate and up-to-date
- [ ] No spelling or grammar errors
- [ ] ATS-friendly format confirmed
- [ ] Print preview looks correct
- [ ] Page loads quickly
- [ ] Emojis display properly across devices
- [ ] Markdown formatting renders correctly
- [ ] Action verbs used consistently
- [ ] Quantified achievements are highlighted
- [ ] Technologies are properly formatted
- [ ] Reverse chronological order maintained

### 10. Future Enhancements
1. **Multiple Versions**: Different resumes for different roles
2. **Custom Templates**: Various design options
3. **Edit Mode**: Update resume from web interface
4. **Analytics**: Track downloads and views
5. **A/B Testing**: Test different formats

## Dependencies
```json
{
  "@react-pdf/renderer": "^3.x.x",  // For PDF generation
  "date-fns": "^3.x.x"              // For date formatting
}
```

## Timeline
- **Day 1**: Setup structure and base components
- **Day 2**: Implement all resume sections
- **Day 3**: Add PDF generation
- **Day 4**: Polish and testing

## Success Criteria
1. Resume page loads within 2 seconds
2. PDF download works on all browsers
3. Content is ATS-friendly
4. Responsive on all devices
5. Maintains portfolio design consistency