# Admin Assistant Manual Testing Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Testing Environment Setup](#testing-environment-setup)
- [Testing Checklist](#testing-checklist)
  - [1. Authentication Flow](#1-authentication-flow)
  - [2. Knowledge Management Page](#2-knowledge-management-page)
  - [3. Creating Knowledge](#3-creating-knowledge)
  - [4. Knowledge Table](#4-knowledge-table)
  - [5. Filtering and Search](#5-filtering-and-search)
  - [6. Editing Knowledge](#6-editing-knowledge)
  - [7. Deleting Knowledge](#7-deleting-knowledge)
  - [8. Pagination](#8-pagination)
  - [9. Analytics Tab](#9-analytics-tab)
  - [10. Import/Export](#10-importexport-placeholder)
  - [11. Error Handling](#11-error-handling)
  - [12. Performance Testing](#12-performance-testing)
  - [13. Responsive Design](#13-responsive-design)
  - [14. Edge Cases](#14-edge-cases)
- [Expected Behaviors](#expected-behaviors)
- [Common Issues to Check](#common-issues-to-check)
- [Sample Test Data](#sample-test-data)

## Prerequisites

### Required Environment Variables
Add these to your `.env.local` file:

```env
# Admin Authentication
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here # Generate with: openssl rand -base64 32

# Existing variables (should already be present)
MONGODB_CONNECTION_STRING=your-mongodb-connection-string
GEMINI_API_KEY=your-gemini-api-key
```

### Database Setup
Ensure MongoDB is running and accessible with your connection string.

## Testing Environment Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Create admin user**:
   ```bash
   pnpm tsx scripts/seed-admin.ts
   ```
   Note the email and password displayed in the console.

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000/admin/assistant`

## Testing Checklist

### 1. Authentication Flow

- [ ] **Access Protected Route**
  - Navigate to `/admin/assistant` without logging in
  - Should redirect to `/admin/login`

- [ ] **Login Page**
  - [ ] Verify login form displays correctly
  - [ ] Check for lock icon and "Admin Login" title
  - [ ] Verify email and password fields are present

- [ ] **Invalid Login Attempts**
  - [ ] Empty email and password → Should show validation error
  - [ ] Incorrect email format → Should show validation error
  - [ ] Correct email, wrong password → Should show "Invalid email or password"
  - [ ] Non-admin user credentials → Should show error

- [ ] **Valid Login**
  - [ ] Enter correct admin credentials
  - [ ] Click Login button
  - [ ] Should redirect to `/admin/assistant`
  - [ ] Verify no error messages appear

- [ ] **Session Persistence**
  - [ ] Refresh the page → Should remain logged in
  - [ ] Open new tab with `/admin/assistant` → Should be logged in
  - [ ] Close browser, reopen → Should remain logged in (within session timeout)

- [ ] **Logout** (if implemented)
  - [ ] Find logout button/link
  - [ ] Click logout
  - [ ] Should redirect to login page
  - [ ] Try accessing `/admin/assistant` → Should redirect to login

### 2. Knowledge Management Page

- [ ] **Page Layout**
  - [ ] Page title: "Knowledge Management"
  - [ ] Subtitle: "Manage the AI assistant's knowledge base"
  - [ ] Action buttons visible: Import, Export, Add Knowledge
  - [ ] Two tabs: "Knowledge Base" and "Analytics"

- [ ] **Initial Load**
  - [ ] Table loads without errors
  - [ ] If no data, shows empty state or message
  - [ ] If data exists, displays in table format

### 3. Creating Knowledge

- [ ] **Open Form**
  - [ ] Click "Add Knowledge" button
  - [ ] Modal/dialog should open
  - [ ] Form title should be "Add New Knowledge"

- [ ] **Form Validation - Empty Fields**
  - [ ] Try submitting empty form → Should show validation errors
  - [ ] Content field → "Content must be at least 10 characters"
  - [ ] Tags field → "At least one tag is required"
  - [ ] Source field → "Source is required"

- [ ] **Form Validation - Invalid Data**
  - [ ] Content < 10 characters (e.g., "Test") → Should show error
  - [ ] No tags added → Should show error
  - [ ] Empty source → Should show error

- [ ] **Category Selection**
  Test each category option:
  - [ ] Personal
  - [ ] Skills
  - [ ] Experience
  - [ ] Projects
  - [ ] Education
  - [ ] Achievements
  - [ ] Contact
  - [ ] Other

- [ ] **Priority Selection**
  Test each priority level:
  - [ ] Low (1)
  - [ ] Medium (2) - should be default
  - [ ] High (3)

- [ ] **Tag Management**
  - [ ] Type tag and press Enter → Tag should be added
  - [ ] Type tag and click "Add" button → Tag should be added
  - [ ] Add multiple tags → All should display
  - [ ] Click X on tag → Tag should be removed
  - [ ] Try adding duplicate tag → Should not add duplicate
  - [ ] Add tag with spaces → Should trim spaces

- [ ] **Successful Submission**
  - [ ] Fill all required fields with valid data
  - [ ] Click "Create" button
  - [ ] Button should show "Creating..." during submission
  - [ ] Success toast: "Knowledge created successfully"
  - [ ] Modal should close
  - [ ] New entry should appear in table

- [ ] **Form Reset**
  - [ ] After successful submission, open form again
  - [ ] All fields should be empty/default

### 4. Knowledge Table

- [ ] **Table Columns**
  Verify all columns are present and display correctly:
  - [ ] Content (truncated for long text)
  - [ ] Category (with colored badge)
  - [ ] Priority (with appropriate styling)
  - [ ] Tags (shows first 3 + count if more)
  - [ ] Queries (number)
  - [ ] Updated (relative time, e.g., "2 hours ago")
  - [ ] Created By (name and email)
  - [ ] Version (e.g., "v1")
  - [ ] Actions (dropdown menu)

- [ ] **Visual Indicators**
  - [ ] Category badges have correct colors (blue for personal, green for skills, etc.)
  - [ ] Priority badges show correct styling (Low=gray, Medium=yellow, High=red)
  - [ ] Long content shows ellipsis (...)
  - [ ] Tags beyond 3 show "+X" indicator

- [ ] **Actions Dropdown**
  - [ ] Click three dots icon → Dropdown opens
  - [ ] Options visible: Edit, Regenerate Embedding, Delete
  - [ ] Click outside → Dropdown closes

### 5. Filtering and Search

- [ ] **Search Functionality**
  - [ ] Type in search box → Results update (may need to press Enter or have debounce)
  - [ ] Search by content keyword → Shows matching entries
  - [ ] Search by tag name → Shows entries with that tag
  - [ ] Clear search → Shows all entries
  - [ ] Search non-existent term → Shows empty results

- [ ] **Category Filter**
  - [ ] Click category dropdown
  - [ ] Select "Personal" → Only personal entries show
  - [ ] Select "Skills" → Only skills entries show
  - [ ] Test each category option
  - [ ] Select "All categories" → All entries show

- [ ] **Sort Options**
  - [ ] Sort by Created Date → Newest/oldest first
  - [ ] Sort by Updated Date → Recently updated first
  - [ ] Sort by Query Count → Most queried first
  - [ ] Sort by Priority → High to low or vice versa

- [ ] **Combined Filters**
  - [ ] Search + Category → Both filters apply
  - [ ] Category + Sort → Filtered results are sorted
  - [ ] Clear one filter → Other remains active

- [ ] **Refresh Button**
  - [ ] Click refresh icon
  - [ ] Loading indicator should show
  - [ ] Data should reload
  - [ ] Current filters should persist

### 6. Editing Knowledge

- [ ] **Open Edit Form**
  - [ ] Click Edit from actions dropdown
  - [ ] Form title should be "Edit Knowledge"
  - [ ] All fields should be pre-populated with current values

- [ ] **Verify Pre-filled Data**
  - [ ] Content matches table entry
  - [ ] Category is correctly selected
  - [ ] Priority is correctly selected
  - [ ] All tags are displayed
  - [ ] Source field is populated

- [ ] **Make Changes**
  - [ ] Update content text
  - [ ] Change category
  - [ ] Change priority
  - [ ] Add new tags
  - [ ] Remove existing tags
  - [ ] Update source

- [ ] **Cancel Edit**
  - [ ] Make changes but click "Cancel"
  - [ ] Modal should close
  - [ ] No changes should be saved
  - [ ] Table data remains unchanged

- [ ] **Save Changes**
  - [ ] Make changes and click "Update"
  - [ ] Button shows "Updating..." during submission
  - [ ] Success toast: "Knowledge updated successfully"
  - [ ] Modal closes
  - [ ] Table reflects all changes
  - [ ] Version number increments (e.g., v1 → v2)

### 7. Deleting Knowledge

- [ ] **Delete Confirmation**
  - [ ] Click Delete from actions dropdown
  - [ ] Confirmation dialog appears: "Are you sure you want to delete this knowledge chunk?"
  - [ ] Shows Cancel and Confirm options

- [ ] **Cancel Deletion**
  - [ ] Click Cancel on confirmation
  - [ ] Dialog closes
  - [ ] Entry remains in table

- [ ] **Confirm Deletion**
  - [ ] Click Confirm/OK on confirmation
  - [ ] Success toast: "Knowledge chunk deleted successfully"
  - [ ] Entry removed from table
  - [ ] Total count updates if displayed

- [ ] **Soft Delete Behavior**
  - [ ] Deleted items should not reappear on refresh
  - [ ] May still exist in database with isActive=false

### 8. Pagination

- [ ] **Setup** (Create >10 entries to test pagination)

- [ ] **Pagination Controls**
  - [ ] Page numbers displayed (e.g., "Page 1 of 2")
  - [ ] Previous button (disabled on first page)
  - [ ] Next button (disabled on last page)
  - [ ] Shows correct number of items per page (10)

- [ ] **Navigation**
  - [ ] Click Next → Goes to page 2
  - [ ] Click Previous → Goes back to page 1
  - [ ] Direct page number clicks (if implemented)

- [ ] **With Filters**
  - [ ] Apply filter that reduces results
  - [ ] Pagination updates accordingly
  - [ ] Navigate pages with filter active
  - [ ] Filter persists across pages

- [ ] **Edge Cases**
  - [ ] Exactly 10 items → No pagination
  - [ ] 11 items → 2 pages (10 + 1)
  - [ ] Delete items to go below page threshold

### 9. Analytics Tab

- [ ] **Switch to Analytics**
  - [ ] Click "Analytics" tab
  - [ ] Tab content changes
  - [ ] No errors in console

- [ ] **Statistics Display**
  Check if these stats are shown (if implemented):
  - [ ] Total chunks count
  - [ ] Active chunks count
  - [ ] Category distribution (chart or list)
  - [ ] Query statistics
  - [ ] Recent activity log
  - [ ] Top queried chunks

- [ ] **Visual Elements**
  - [ ] Charts render correctly
  - [ ] Numbers are formatted properly
  - [ ] Colors match category colors

- [ ] **Data Accuracy**
  - [ ] Stats match actual data in Knowledge Base tab
  - [ ] Creating new knowledge updates stats
  - [ ] Deleting knowledge updates stats

### 10. Import/Export (Placeholder)

- [ ] **Import Function**
  - [ ] Click Import button
  - [ ] Toast shows: "Import functionality not yet implemented"
  - [ ] No errors occur

- [ ] **Export Function**
  - [ ] Click Export button
  - [ ] Toast shows: "Export functionality not yet implemented"
  - [ ] No errors occur

### 11. Error Handling

- [ ] **Network Errors**
  - [ ] Stop backend server
  - [ ] Try creating knowledge → Error toast appears
  - [ ] Try editing → Error toast appears
  - [ ] Try deleting → Error toast appears
  - [ ] Try searching → Error handling (graceful failure)

- [ ] **API Errors**
  - [ ] Modify request to send invalid data → Error response handled
  - [ ] Test with invalid IDs → 404 handled properly
  - [ ] Test unauthorized access → 401 handled

- [ ] **Form Errors**
  - [ ] All validation messages are user-friendly
  - [ ] Errors clear when corrected
  - [ ] Multiple errors show appropriately

- [ ] **Loading States**
  - [ ] Initial page load shows loading indicator
  - [ ] Form submission shows loading state
  - [ ] Delete operation shows loading
  - [ ] Refresh shows loading

### 12. Performance Testing

- [ ] **Load Time**
  - [ ] Page loads within 3 seconds
  - [ ] Table renders smoothly with 50+ entries
  - [ ] No visible lag when scrolling

- [ ] **Search Performance**
  - [ ] Search responds quickly (<500ms)
  - [ ] No UI freezing during search
  - [ ] Debouncing prevents excessive requests

- [ ] **Memory Usage**
  - [ ] Page doesn't slow down after extended use
  - [ ] Creating/editing many items doesn't cause issues
  - [ ] Browser memory usage remains reasonable

### 13. Responsive Design

Test on different screen sizes:

- [ ] **Desktop (1920x1080)**
  - [ ] Full table visible
  - [ ] All columns display properly
  - [ ] Modal/forms centered

- [ ] **Laptop (1366x768)**
  - [ ] Table adjusts width
  - [ ] All functionality accessible
  - [ ] No horizontal overflow

- [ ] **Tablet (768x1024)**
  - [ ] Table scrolls horizontally if needed
  - [ ] Forms adapt to width
  - [ ] Touch interactions work

- [ ] **Mobile (375x667)**
  - [ ] Mobile-friendly layout
  - [ ] Table is scrollable
  - [ ] Forms stack vertically
  - [ ] Buttons remain clickable

### 14. Edge Cases

- [ ] **Long Content**
  - [ ] Create entry with 1000+ character content
  - [ ] Verify truncation in table
  - [ ] Full content visible in edit form

- [ ] **Many Tags**
  - [ ] Add 15+ tags to an entry
  - [ ] Verify "+X" count is correct
  - [ ] All tags visible in edit form

- [ ] **Special Characters**
  - [ ] Use special characters in content: `<>{}[]&@#$%`
  - [ ] Use Unicode/emoji: 😀🎉🚀
  - [ ] Use quotes: "test" 'test'
  - [ ] Verify proper display and storage

- [ ] **Rapid Actions**
  - [ ] Double-click submit → Only one submission
  - [ ] Rapid delete clicks → Only one deletion
  - [ ] Quick page navigation → No errors

- [ ] **Multiple Tabs**
  - [ ] Open admin in two tabs
  - [ ] Create in one tab → Refresh other tab shows new entry
  - [ ] Edit in one tab → Other tab shows stale data until refresh

## Expected Behaviors

### Form Validation Rules
| Field | Validation | Error Message |
|-------|------------|---------------|
| Content | Min 10 characters | "Content must be at least 10 characters" |
| Category | Required selection | Auto-selected, no error |
| Priority | Required (default: 2) | Auto-selected, no error |
| Tags | Min 1 tag | "At least one tag is required" |
| Source | Required | "Source is required" |

### Visual Indicators
| Element | Behavior |
|---------|----------|
| Loading | Spinner or "Loading..." text |
| Disabled | Grayed out, cursor not-allowed |
| Success | Green toast notification |
| Error | Red toast notification |
| Info | Blue toast notification |

### Category Colors
| Category | Badge Color |
|----------|-------------|
| Personal | Blue |
| Skills | Green |
| Experience | Purple |
| Projects | Orange |
| Education | Indigo |
| Achievements | Yellow |
| Contact | Pink |
| Other | Gray |

### Priority Styling
| Priority | Label | Color |
|----------|-------|-------|
| 1 | Low | Gray |
| 2 | Medium | Yellow |
| 3 | High | Red |

## Common Issues to Check

### Authentication Issues
- **Session Timeout**: User gets logged out unexpectedly
- **Redirect Loop**: Continuous redirect between login and admin
- **Permission Denied**: Non-admin users accessing admin routes

### Data Integrity Issues
- **Duplicate Entries**: Same content created multiple times
- **Missing Data**: Required fields saved as null/undefined
- **Version Conflicts**: Concurrent edits overwriting each other

### UI/UX Issues
- **Form State**: Form not clearing after submission
- **Modal Issues**: Modal not closing or opening multiple times
- **Table Refresh**: Changes not reflecting immediately
- **Filter Persistence**: Filters resetting unexpectedly

### Performance Issues
- **Slow Search**: Search taking >1 second
- **Memory Leaks**: Page slowing down over time
- **Large Data**: Table struggling with many entries

## Sample Test Data

### Knowledge Entries

```javascript
// Personal Category
{
  content: "I am a full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating scalable web applications.",
  category: "personal",
  priority: 3,
  tags: ["developer", "full-stack", "introduction"],
  source: "resume"
}

// Skills Category
{
  content: "Proficient in JavaScript, TypeScript, Python, and Go. Experienced with React, Next.js, Express, Django, and various databases including MongoDB and PostgreSQL.",
  category: "skills",
  priority: 3,
  tags: ["programming", "languages", "frameworks", "technical"],
  source: "skills_assessment"
}

// Experience Category
{
  content: "Led development of a microservices architecture that improved system performance by 40% and reduced deployment time from hours to minutes using Docker and Kubernetes.",
  category: "experience",
  priority: 2,
  tags: ["architecture", "microservices", "devops", "leadership"],
  source: "work_history"
}

// Projects Category
{
  content: "Created an AI-powered portfolio assistant that helps visitors learn about my experience through natural conversation. Built with Next.js, MongoDB, and Google Gemini API.",
  category: "projects",
  priority: 3,
  tags: ["AI", "portfolio", "full-stack", "current"],
  source: "project_docs"
}

// Edge Case - Long Content
{
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  category: "other",
  priority: 1,
  tags: ["test", "long-content", "edge-case"],
  source: "test_data"
}

// Edge Case - Special Characters
{
  content: "Test with special characters: <script>alert('test')</script> & symbols like @#$% and quotes \"test\" 'test' and emoji 🚀😀🎉",
  category: "other",
  priority: 1,
  tags: ["test", "special-chars", "😀emoji"],
  source: "test_special"
}
```

### Test Scenarios

1. **Bulk Testing**: Create 15-20 entries to test pagination
2. **Search Testing**: Use entries with unique keywords
3. **Category Distribution**: Create 2-3 entries per category
4. **Priority Testing**: Mix of high, medium, and low priority items
5. **Tag Testing**: Some with 1 tag, some with 5+, some with duplicate tags across entries

---

## Testing Completion

- [ ] All sections tested
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] UI/UX smooth and intuitive
- [ ] Error handling working properly
- [ ] Ready for production

**Tested By**: _________________  
**Date**: _________________  
**Environment**: _________________  
**Notes**: _________________