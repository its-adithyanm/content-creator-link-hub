\# SnapBlitz Link Hub

A modern searchable link hub built for content creators who need to share hundreds of resources using a single bio link.

This project was originally created to solve a real problem faced while managing a large Instagram audience and handling thousands of repeated link requests manually.

---

# Why This Project Exists

As a content creator with 276K+ followers, I faced several problems:

* Instagram bio only allows one link
* Followers constantly ask for the same links repeatedly
* Manual DM replies take too much time
* Existing link-in-bio tools lack proper search functionality
* Instagram automation tools can become unreliable or restricted

So instead of depending completely on automation systems, I built my own searchable link directory system.

Followers can simply search for what they need and instantly access the correct link.

---

# Important Note

This project was made almost entirely using AI coding tools and no-code / low-code workflows.

I am not a professional developer and still learning programming.
There may be bugs, inefficient code, or mistakes inside the project.

The main goal of this project was solving a real-world creator problem in the simplest possible way.

If anyone wants to improve the project, fix bugs, optimize performance, or add features, contributions are always welcome.

---

# What This Website Does

SnapBlitz Link Hub allows creators to:

* Share unlimited links using one bio URL
* Let followers search resources instantly
* Organize tools, apps, games, prompts, downloads, and websites
* Share AI prompts directly inside the website
* Add follow-to-unlock style interactions
* Manage everything from a local admin panel

---

# Core Features

## Search System

* Real-time search with keyword matching
* Fuzzy search support for small typos
* Highlighted matching text
* Fast filtering and sorting
* Priority-based ranking system

---

## Link System

Each card can contain:

* Title
* Description
* Keywords
* Thumbnail
* Redirect URL
* CTA text
* Custom button text
* Visibility controls
* Priority sorting

---

## AI Prompt Support

Special prompt-type links are supported.

Instead of redirecting users to a URL:

* A modal opens
* The AI prompt is displayed
* Users can copy prompts instantly

Useful for:

* ChatGPT prompts
* Instagram reel prompts
* Editing prompts
* Automation prompts
* AI workflow sharing

---

## Follow-to-Unlock Modal

Custom follow verification flow included:

* User clicks link
* Follow popup appears
* "Already Following" button triggers:

  * fake verification loader
  * animated spinner
  * success tick animation
  * delayed redirect system

This was intentionally designed as a lightweight frontend-only engagement system without requiring expensive social APIs.

---

## Local Admin Panel (NEW)

The project now includes a fully separate local admin panel system.

## Admin Features

### General Settings Editor

Edit:

* Site title
* Profile URL
* Profile photo
* Theme colors
* Social media links
* Default button text
* Max search results

---

### Link Management System

Add/Edit/Delete:

* Standard links
* AI prompt links
* Redirect links
* Keywords
* CTA texts
* Button labels
* Priorities
* Visibility status

---

### Thumbnail Upload Support

Upload:

* Link thumbnails
* Profile photos

The admin panel automatically:

* Detects filenames
* Updates `data.js`
* Generates correct asset paths

---

### Local-Only Workflow

The admin panel works completely offline.

No:

* database
* backend server
* hosting API
* authentication system
* cloud CMS

Everything works using:

* HTML
* CSS
* Vanilla JavaScript

---

# Project Structure

```text
content-creator-link-hub/
│
├── index.html
├── styles.css
├── app.js
├── data.js
│
├── admin/
│   ├── index.html
│   ├── admin.css
│   ├── admin.js
│   ├── data.js
│   │
│   └── Assets/
│       ├── Profile photo/
│       └── Links thumbnail/
│
├── Assets/
│   ├── Profile photo/
│   └── Links thumbnail/
│
├── copyright.html
├── privacy.html
└── disclaimer.html
```

---

# How The Admin Panel Works

The frontend website remains completely untouched.

The admin panel acts like a local CMS/editor.

Workflow:

1. Open:

```text
admin/index.html
```

2. Edit your links visually

3. Upload thumbnails if needed

4. Press SAVE

5. Replace:

* frontend `data.js`
* frontend `Assets/`

with updated admin versions

6. Push updated files to GitHub

---

# How The Website Works

* `data.js` stores all content
* `index.html` loads data and UI
* `app.js` handles:

  * search
  * cards
  * prompts
  * modals
  * redirects
* `styles.css` handles:

  * layout
  * animations
  * dark theme
  * responsive design

---

# Search Behaviour

Search checks:

* title
* description
* keywords

Features:

* real-time filtering
* fuzzy matching
* highlighted keywords
* smooth debounce system

---

# Performance Notes

The system is designed to support large numbers of links.

However:

* extremely large datasets (500–1000+ links)
* massive thumbnail libraries
* unoptimized images

may eventually affect browser performance because everything runs client-side.

Future optimizations may include:

* lazy loading
* JSON chunk loading
* pagination
* indexed search
* backend APIs

---

# Tech Stack

* HTML
* CSS
* Vanilla JavaScript
* Client-side search system
* No frameworks
* No build tools
* No database
* No backend

---

# Designed For

* Instagram creators
* YouTube creators
* Reels creators
* Shorts creators
* Tech creators
* Gaming creators
* AI creators
* Resource-sharing communities

---

# Open Source & Contributions

This project is fully open source.

If you want to:

* improve UI
* optimize performance
* fix bugs
* improve search
* add backend support
* create plugins
* improve mobile UX

feel free to contribute.

Since this project was built mainly with AI-assisted coding tools, there may be architectural mistakes or beginner-level implementations.

All improvements are appreciated.

---

# License

You are free to:

* use
* modify
* customize
* fork
* improve

this project for personal or commercial use.

Attribution is appreciated but not required.
