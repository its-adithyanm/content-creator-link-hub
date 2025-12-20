Content Creator Link Hub
A searchable link directory website for content creators. Solves the problem of sharing multiple links when you only have space for one in your bio.

The Problem
As a content creator with 276K followers, I faced these issues:

Instagram bio only allows one link

Cannot manually send links to everyone

Followers struggle to find specific content

Existing tools lack proper search functionality

So I built this.

What It Does
A simple website where your followers can search for any link they need. You update one file, they search and get the link instantly.

Features
Real-time search with keyword matching

Highlighted search results

Custom thumbnails for each link

Social media integration

Customizable color theme

Mobile-friendly design

Footer pages for copyright, privacy, and disclaimer

No database or backend needed

How to Use
1. Setup Your Profile
Edit data.js and change:

javascript
siteTitle: "Your Name",
profileUrl: "https://www.instagram.com/yourhandle",
profilePhotoUrl: "Assets/Profile photo/profile.jpg",
Add your social media links:

javascript
socialMedia: {
  instagram: "https://www.instagram.com/yourhandle",
  youtube: "https://www.youtube.com/@yourchannel",
  telegram: "https://t.me/yourhandle"
}
2. Add Your Links
In data.js, add links like this:

javascript
{
  id: "premiere-pro",
  title: "Premiere Pro",
  description: "Professional video editing software",
  keywords: ["premiere", "video editor", "adobe", "editing"],
  thumbnail: "Assets/Links thumbnail/premiere.webp",
  buttonText: "Download",
  ctaText: "Follow @your_handle to download",
  followRedirectUrl: "https://example.com/premiere",
  priority: 1,
  visible: true
}
3. Add Images
Put your images in the right folders:

Profile Photo:

Location: Assets/Profile photo/profile.jpg

Size: 400x400px

Format: JPG or PNG

Link Thumbnails:

Location: Assets/Links thumbnail/

Size: 256x256px

Format: PNG for icons, JPG for photos

4. Customize Colors
Change the theme colors in data.js:

javascript
theme: {
  backgroundPrimary: "#000000",
  accentPrimary: "#8b5cf6",
  accentSecondary: "#7c3aed"
}
5. Deploy
Upload all files to:

GitHub Pages

Netlify

Vercel

Any web hosting

File Structure
text
Project/
├── index.html
├── styles.css
├── app.js
├── data.js (edit this file)
├── Assets/
│   ├── Profile photo/
│   │   └── profile.jpg (400x400px)
│   └── Links thumbnail/
│       └── your-images.png (256x256px)
├── copyright.html
├── privacy.html
└── disclaimer.html
How It Works
Followers visit your link hub

They search for what they need using keywords

Results show up instantly with highlighted matches

They click to get the link

Search Features
Searches in title, description, and keywords

Shows highlighted matches

Works in real-time as you type

Fuzzy search for typos

Customization
Everything is customizable:

Colors and theme

Profile photo

Social media links

Link thumbnails

Button text

Search result limit

Tech Details
Built with simple HTML, CSS, and JavaScript. Uses Fuse.js for search functionality. No frameworks or complicated setup needed.

Requirements
Just a web browser and basic text editor. No coding knowledge required to add links.

Deploy to GitHub Pages
Upload all files to this repository

Go to Settings > Pages

Select main branch

Your site will be live at username.github.io/repo-name

For Content Creators
Perfect for:

Instagram creators

YouTube creators

Tech reviewers

Anyone sharing resources with followers

Made By
A tech content creator who needed a simple solution for link sharing.

License
Free to use and modify for your own projects.

