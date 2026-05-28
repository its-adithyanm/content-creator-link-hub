# Content Creator Link Hub

A premium searchable link hub built for modern content creators.

Designed to solve the “one bio link” problem while giving followers a smooth, searchable, and interactive experience.

---

# Why This Project Exists

As a content creator with a large audience, I faced a real problem:

* Instagram bio only allows one link
* Followers constantly ask for resources
* Manually sending links to everyone is impossible
* Existing “link in bio” tools lacked proper search functionality
* Instagram automation systems can sometimes get restricted or limited

So instead of depending entirely on automation tools, I built my own searchable link hub where followers can instantly find the exact resource they need.

This project was made mainly for personal use and creator workflow optimization.

---

# What This Website Does

This is a fully static searchable resource hub where users can:

* Search resources instantly
* Access download links
* Open AI prompts
* Follow social links
* Submit support requests
* Navigate premium modal-based flows

Everything is managed from a single `data.js` file.

No backend required.

---

# NEW FEATURES & UPDATES

## AI Prompt Modal System

Links can now optionally contain AI prompts instead of direct downloads.

New optional field inside `data.js`:

```js id="nrpruq"
promptText: "Your AI prompt here..."
```

### How It Works

If a link contains `promptText`:

* Clicking “Already Following” opens a premium AI prompt modal
* Users can:

  * Read prompts
  * Scroll long content
  * Copy prompts instantly
  * Close smoothly

If `promptText` is NOT provided:

* Original redirect behavior continues normally

This allows the project to work as:

* AI Prompt Library
* Resource Hub
* Tool Directory
* Creator Toolkit
* Download Center

without changing the core structure.

---

## Premium Follow Verification Flow

The original instant redirect system has been upgraded into a premium verification experience.

### New Flow

User clicks resource →
“Follow to Continue” modal opens →
User clicks “Already Following” →
Verification animation starts →
Success tick animation →
Automatic redirect

### Verification UI Includes

* Animated loading spinner
* “Verifying you are following...” state
* Smooth fade transitions
* Animated success tick
* Auto redirect after 3 seconds

### Important

This is a simulated verification flow.

No Instagram API or third-party verification system is used.

The purpose is simply to improve UX and encourage creator follows.

---

## Built-In Support Request System

A fully custom support modal has been added.

### Features

* Floating support button
* Dark premium popup modal
* Name field
* Email field
* Problem/message textarea
* Smooth animations
* Validation states
* Loading state
* Success state
* Retry/error state
* Mobile responsive design

### Google Forms Integration

Support submissions are automatically sent into Google Forms using hidden form field mappings.

No backend or database required.

---

## Legal Pages System

Integrated legal pages include:

* Privacy Policy
* Disclaimer
* Copyright

### Improvements

* Better modal loading
* Local static file support
* Responsive formatting
* Smooth animations
* Dark UI integration

---

# Features

* Real-time search
* Fuzzy keyword matching
* Highlighted search results
* AI prompt modal system
* Premium verification flow
* Support request popup
* Google Forms integration
* Custom thumbnails
* Responsive design
* Floating support action button
* Smooth modal animations
* Social profile links
* Footer legal pages
* Dark premium UI
* Static hosting support
* No backend required

---

# Project Structure

```text id="jvfy6n"
content-creator-link-hub/
│
├── index.html
├── styles.css
├── app.js
├── data.js
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

# How To Use

## 1. Configure Your Profile

Open `data.js`:

```js id="v73ay0"
siteTitle: "Your Name",
profileUrl: "https://instagram.com/yourhandle",
profilePhotoUrl: "Assets/Profile photo/profile.jpg",
```

Update social links:

```js id="zw7l9m"
socialMedia: {
  instagram: "",
  youtube: "",
  telegram: "",
  linkedin: "",
  facebook: ""
}
```

---

## 2. Add Resource Links

Example:

```js id="bkg5j4"
{
  id: "premiere-pro",
  title: "Premiere Pro",
  description: "Professional video editing software",
  keywords: ["premiere", "editing", "video"],
  thumbnail: "Assets/Links thumbnail/premiere.webp",

  buttonText: "Download",

  ctaText: "Follow @snap_blitz to continue",

  followRedirectUrl: "https://example.com",

  promptText: `
    Optional AI prompt text here
  `,

  priority: 1,
  visible: true
}
```

---

# Link Fields

| Field               | Description              |
| ------------------- | ------------------------ |
| `id`                | Unique identifier        |
| `title`             | Resource title           |
| `description`       | Resource description     |
| `keywords`          | Search keywords          |
| `thumbnail`         | Thumbnail image path     |
| `buttonText`        | Button text              |
| `ctaText`           | Modal CTA message        |
| `followRedirectUrl` | Redirect destination     |
| `promptText`        | Optional AI prompt modal |
| `priority`          | Sorting priority         |
| `visible`           | Hide/show resource       |

---

# Search Behaviour

Search works inside:

* title
* description
* keywords

### Features

* Real-time filtering
* Fuzzy matching
* Highlighted matches
* Smooth rendering
* Debounced input for performance

---

# Scalability

The project is optimized to support:

* Hundreds of links
* Large keyword lists
* Large AI prompt libraries
* Creator resource directories

### Performance Optimizations

* Efficient filtering
* Lightweight rendering
* Debounced searching
* Vanilla JS architecture
* No unnecessary frameworks

Even large collections should perform smoothly on static hosting.

---

# Customization

You can easily customize:

* Theme colors
* Accent colors
* Button texts
* CTA messages
* Search behavior
* Social links
* Legal page content
* Prompt modal styles
* Support modal styles

All mainly controlled through `data.js` and `styles.css`.

---

# Tech Stack

* HTML
* CSS
* Vanilla JavaScript
* Client-side fuzzy search
* Google Forms integration
* Static hosting architecture

No frameworks.
No backend.
No database.

---

# Hosting

Can be deployed on:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages
* Any static web host

---

# Developer Note

This project was created mainly using AI tools and vibe-coding workflows.

I am not a professional developer and do not have deep coding knowledge.

This project was built to solve a real personal creator problem as quickly and practically as possible.

Most of the development process involved:

* AI coding tools
* ChatGPT
* experimentation
* self-learning
* trial and error
* real-world creator needs

Because this project was heavily AI-assisted and vibe-coded, there may still be:

* bugs,
* imperfect code,
* UI inconsistencies,
* edge-case issues,
* scalability limitations,
* or non-optimal engineering decisions.

The main goal was functionality and usefulness, not perfect software engineering.

This tool was created primarily for self-use because Instagram automation systems and platform restrictions can sometimes interfere with resource sharing workflows.

Instead of relying completely on automation tools, I built a searchable static resource hub for my followers.

If you are a developer and want to:

* improve the code,
* optimize performance,
* fix bugs,
* improve UI/UX,
* add features,
* or contribute in any way,

your help is genuinely appreciated.

Community improvements and pull requests are always welcome.

---

# License

You are free to:

* use,
* modify,
* customize,
* and adapt

this project for personal or commercial creator use.
