# Client Handoff Guide: Linque Website Content Management System

##  Overview
This website comes with a professional content management system that allows you to:
-  Add, edit, and delete blog posts
-  Manage job postings  
-  Publish content instantly to your live website
-  Access from anywhere with internet connection

##  Accessing Your Admin Panel

### Primary Access (Recommended)
**URL**: `https://admin.linqueresourcing.com`

### Alternative Access Methods
- `https://linqueresourcing.com/admin`
- `https://linqueresourcing.com/cms`
- `https://linqueresourcing.com/dashboard`

## 👤 Your Admin Login Credentials

**Email**: `etoure33@gmail.com` or `info@linqueresourcing.com`
**Password**: `HelloWorld2025` (if etoure33) or `LinqueAdmin2024!` (if info)

>  **Important**: Let me know once this works well. We will immidiately change these passwords

##  How to Manage Content

### Managing Blog Posts
1. Go to your admin panel and log in
2. Click the "Posts" tab
3. Click "New post" to create content
4. Fill in all fields:
   - **Title**: The main headline
   - **Slug**: URL-friendly version (auto-generated)
   - **Category**: Choose appropriate category
   - **Tags**: Comma-separated keywords
   - **Excerpt**: Brief summary for preview
   - **Description**: Meta description for SEO
   - **Content Sections**: Add multiple sections with headings and content
5. Save as "Draft" first to review
6. Change status to "Published" when ready to go live

### Managing Job Postings  
1. Click the "Jobs" tab
2. Click "New job" to create a posting
3. Fill in job details:
   - **Basic Info**: Title, location, employment type
   - **Job Details**: Department, remote type, summary
   - **Requirements**: Responsibilities and qualifications
   - **Application**: Email or URL for applications
4. Save as "Draft" to review
5. Publish when ready to accept applications

### Content Status Guide
- **Draft**: Only visible to you in admin panel
- **Published**: Live on your website immediately

## 🔧 Technical Information (For Your Developer/IT Person)

### Supabase Database Details
- **Project URL**: `https://pjulmtncozgzunwfsqnx.supabase.co`
- **Database Password**: `LinqueDB2024!`
- **Admin Email**: `etoure33@gmail.com`

>  **Important**: Let me know once this works well. We will immidiately change these passwords

### Netlify Hosting Details  
- **Site URL**: `https://linqueresourcing.com`
- **Admin URL**: `https://admin.linqueresourcing.com`
- **Repository**: `https://github.com/deeboai/linque-website`

### Environment Variables (Already Configured)
- `VITE_SUPABASE_URL`: Database connection
- `VITE_SUPABASE_ANON_KEY`: Database access key

##  Troubleshooting

### Can't Log In?
1. Double-check the URL: `https://admin.linqueresourcing.com`
2. Use the correct credentials provided above
3. Check if caps lock is on
4. Try the alternative URLs listed above

### Content Not Appearing on Website?
1. Make sure content status is "Published" (not "Draft")
2. Wait 1-2 minutes for changes to propagate
3. Refresh your website page
4. Clear your browser cache

### Forgot Password?
1. Click "Forgot Password" on login screen
2. Check your email for reset link
3. Follow the instructions to create a new password

##  Support
If you need help or have questions:
1. Check this guide first
2. Contact your developer who set this up
3. All your content is safely backed up in the database

##  Security Best Practices
-  Don't share login credentials
-  Log out when finished editing
-  Only access admin panel from trusted devices/networks

---

*This content management system was built with modern, secure technology and requires no special software - just a web browser!*