# Content Creator Link Hub

A premium searchable link hub built for modern content creators.
Designed to solve the “one bio link” problem while giving followers a smooth and interactive experience.

---

# NEW UPDATES & FEATURES

The project has been significantly upgraded with premium UI interactions, smarter link handling, AI prompt support, animated verification flows, and built-in support tools.

## What's New

### AI Prompt Link System

Links can now optionally contain AI prompts instead of direct downloads.

New optional field in `data.js`:

```js
promptText: "Your AI prompt here..."
```

How it works:

* If a link contains `promptText`, clicking “Already Following” opens a premium prompt modal.
* Users can:

  * View the full AI prompt
  * Scroll through long prompts
  * Copy prompts instantly
  * Close the modal smoothly
* Existing redirect links still work normally.
* Links without `promptText` continue using the original redirect system.

This allows the website to work as:

* Resource hub
* AI prompt library
* Creator toolkit
* Download center

without changing the core structure.

---

## Premium Follow Verification Flow

The old instant redirect system has been upgraded.

### New Flow

When users click:

```text
Already Following
```

they now see:

* Animated verification modal
* Circular loading spinner
* “Verifying you are following...” message
* 3-second premium verification animation
* Animated success tick mark
* Automatic redirect after verification

This creates a much smoother and more premium user experience.

### Important

This is a simulated verification flow.
No Instagram API or third-party verification service is used.

---

## Built-In Support Form System

A fully custom support request modal has been added.

### Features

* Floating support button
* Premium popup modal
* Name field
* Email field
* Problem/message textarea
* Real-time validation
* Loading animation
* Success state with animated tick
* Error state with retry button
* Mobile responsive design

### Google Forms Integration

Submissions are automatically sent directly into Google Forms using hidden form entry mapping.

No backend or database required.

---

## Legal Pages System

The project now includes fully integrated legal pages:

* Privacy Policy
* Disclaimer
* Copyright

### Improvements

* Proper modal/page loading
* Static HTML fallback support
* Better local file handling
* Mobile responsive formatting
* Premium dark styling

---

# Updated Features List

## Features

* Real-time search with keyword matching
* Highlighted search results
* AI prompt modal system
* Premium follow verification flow
* Custom thumbnails for every link
* Google Forms powered support system
* Floating support action button
* Smooth modal animations
* Animated success/error states
* Social media profile links
* Responsive dark theme
* Footer legal pages
* Fuzzy search support
* Static hosting friendly
* No backend required

---

# Updated Link Structure

Each link inside `data.js` now supports:

```js
{
  id: "chatgpt-prompt",
  title: "ChatGPT Prompt Pack",
  description: "Advanced AI prompts for creators",
  keywords: ["chatgpt", "ai", "prompt"],
  thumbnail: "Assets/Links thumbnail/prompt.webp",

  buttonText: "Get Prompt",

  ctaText: "Follow @snap_blitz to continue",

  followRedirectUrl: "https://example.com",

  promptText: `
    Write a cinematic YouTube intro
    with dark neon aesthetics...
  `,

  priority: 1,
  visible: true
}
```

## New Optional Field

| Field        | Description                                   |
| ------------ | --------------------------------------------- |
| `promptText` | Opens prompt modal instead of direct redirect |

If `promptText` is missing:

* Original redirect behavior remains unchanged.

---

# Performance & Scalability

The website is optimized for large link collections.

### Supported

* Hundreds of links
* Large keyword lists
* Fast search filtering
* Real-time rendering

### Optimizations

* Debounced search
* Lazy rendering logic
* Efficient filtering
* Lightweight vanilla JS architecture

The project can scale to large resource libraries without requiring a backend.

---

# Tech Stack

* HTML
* CSS
* Vanilla JavaScript
* Client-side fuzzy search
* Google Forms integration
* Static hosting architecture

No frameworks or build tools required.

---

# Perfect For

* Instagram creators
* AI prompt sellers
* Digital product creators
* YouTube creators
* Tool curators
* Resource directories
* Gaming creators
* Educational creators
* Automation creators

---

# Why This Project Exists

Most “link in bio” tools are:

* cluttered,
* slow,
* limited,
* or lack search functionality.

This project was built to create a:

* searchable,
* scalable,
* creator-focused,
* premium-feeling link hub

that works entirely with static hosting.

---

# Hosting

Can be deployed easily on:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages
* Any static host

No server required.

---

# License

You are free to:

* use,
* modify,
* customize,
* and adapt

this project for personal or commercial creator use.
