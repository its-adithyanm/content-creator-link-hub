# Content Creator Link Hub

A searchable link directory website for content creators. Solves the problem of sharing multiple links when you only have space for one in your bio.

## The Problem

As a content creator with 276K followers, I faced these issues:
- Instagram bio only allows one link
- Cannot manually send links to everyone
- Followers struggle to find specific content
- Existing tools lack proper search functionality

So this project was created to fix that.

## What It Does

A simple website where followers can search for any link they need. You update one config file, they search, and get the link instantly.

## Features

- Real-time search with keyword matching
- Highlighted search results in titles and descriptions
- Custom thumbnail image for each link
- Social media profile links
- Customizable dark theme
- Mobile-friendly layout
- Footer pages for copyright, privacy, and disclaimer
- No database, no backend, just static files

## How to Use

### 1. Set Up Your Profile

Open `data.js` and edit these fields:

siteTitle: "Your Name",
profileUrl: "https://www.instagram.com/yourhandle",
profilePhotoUrl: "Assets/Profile photo/profile.jpg",

text

Update your social media links:

socialMedia: {
instagram: "https://www.instagram.com/yourhandle",
youtube: "https://www.youtube.com/@yourchannel",
telegram: "https://t.me/yourhandle"
}

text

### 2. Add Your Links

In `data.js`, each link is an object inside the `links` array:

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

text

- `id`: unique id (no spaces)
- `title`: name of the link
- `description`: short description
- `keywords`: words users might search for
- `thumbnail`: path to thumbnail image
- `buttonText`: text on the button
- `ctaText`: message shown in the modal
- `followRedirectUrl`: where the button redirects
- `priority`: lower number = shown higher
- `visible`: set to `false` to hide a link

### 3. Add Images

Place your images in these folders:

- Profile photo  
  - Path: `Assets/Profile photo/profile.jpg`  
  - Size: 400x400 px  
  - Format: JPG or PNG  

- Link thumbnails  
  - Path: `Assets/Links thumbnail/`  
  - Size: 256x256 px  
  - Format: PNG for icons, JPG for photos  

Update the `thumbnail` field in each link object to match your filenames.

### 4. Customize Theme

Change basic colors in `data.js`:

theme: {
backgroundPrimary: "#000000",
accentPrimary: "#8b5cf6",
accentSecondary: "#7c3aed"
}

text

These values control the background and accent colors used in the UI.

### 5. Deploy

This is a static site, so you can host it anywhere:

- GitHub Pages
- Netlify
- Vercel
- Any static web hosting

Upload all project files, then share the main URL in your bio.

## File Structure

Project/
├── index.html
├── styles.css
├── app.js
├── data.js # main config file you edit
├── Assets/
│ ├── Profile photo/
│ │ └── profile.jpg # 400x400
│ └── Links thumbnail/
│ └── your-images.png # 256x256
├── copyright.html
├── privacy.html
└── disclaimer.html

text

## How It Works

- `data.js` holds profile data, theme, social links, and all link items.
- `index.html` loads `data.js` and `app.js`.
- `app.js` reads `window.SITE_DATA`, builds the cards, and wires up search, modals, and footer pages.
- `styles.css` controls the dark UI, responsive layout, and animations.

## Search Behaviour

- Searches inside `title`, `description`, and `keywords`.
- Matches are highlighted in the text.
- Works as you type, with a small delay to keep it smooth.
- Can handle small typos thanks to fuzzy matching.

## Customization Options

You can easily tweak:

- Colors (via `theme` in `data.js`)
- Number of results (via `maxResults` in `data.js`)
- Button texts and CTA messages
- Social icons shown in the header
- Legal pages content (`copyright.html`, `privacy.html`, `disclaimer.html`)

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Client-side search (Fuse-style fuzzy search)
- No build tools or frameworks required

## For Content Creators

Designed for:

- Instagram and Reels creators
- YouTube and Shorts creators
- Tech and gaming creators
- Anyone who shares tools, apps, or resources with followers

## License

You are free to use, modify, and adapt this project for your own link hub.
