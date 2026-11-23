# Deep Sea Portfolio // BECERRA ELIJAH 10C F26 🌊

An abyssal bioluminescent portfolio website created for **Elijah Becerra** (Santa Monica College, 10C Fall 2026). Engineered with pure HTML5, CSS3, and JavaScript—designed specifically to showcase creative work, design artifacts, and coding projects on **GitHub Pages**.

---

## 🌌 Features & Deep Sea Aesthetic

- **Abyssal Bioluminescent Theme**: Dark oceanic trench palette (`#010814` to `#081d3d`) illuminated with electric cyan, seafoam mint, and coral bioluminescent highlights.
- **Dynamic Marine Snow & Plankton Engine (`scripts/main.js`)**: Real-time canvas simulation of organic ocean particulates, glowing plankton, and rising microbubbles reacting to cursor motion.
- **Submersible Depth HUD**: Real-time telemetry gauge that calculates your descent through ocean zones from the surface (**Epipelagic -120m**) down to the Mariana Trench (**Hadal Zone -11,034m**).
- **Submersible Searchlight Switch (`scripts/lightswitch.js`)**: Press the **Biolum / Floodlight** button or press **`L`** on your keyboard to activate the mouse-following submarine searchlight!
- **Specimen Viewport (`Demo.png`)**: Features a futuristic submersible display scanner frame with CRT scanlines and laser sweeps for your primary visual showcase.
- **Filterable Projects Grid**: Easily sort projects by *Web & Apps*, *Graphic Design*, or *3D & Motion*.
- **Interactive Specimen Lightbox**: Click *Inspect Specimen* on any project card to open an interactive full-screen preview modal.
- **Sonar Transmission Console**: Submersible telegraph contact form with instant validation feedback.

---

## 📁 Directory Structure

```text
elijah-portfolio/
├── index.html               # Main webpage
├── Demo.png                 # Primary specimen image (500x600)
├── css/
│   └── styles.css           # Deep sea styling, glows & animations
├── scripts/
│   ├── lightswitch.js       # Searchlight & bioluminescence toggle
│   └── main.js              # Canvas physics, depth HUD, modal & filters
├── images/
│   ├── favicon.png          # Oceanic glowing compass favicon
│   ├── project-1.png        # Abyssal 3D Explorer preview
│   ├── project-2.png        # Biolum Branding preview
│   ├── project-3.png        # Deep Caustics Engine preview
│   └── project-4.png        # Trench Motion Reel preview
└── README.md                # Documentation & GitHub Pages guide
```

---

## 🛠️ How to Customize Your Portfolio

### 1. Swapping `Demo.png`
Simply replace `Demo.png` in the root folder with your preferred photo, artwork, or screenshot (recommended aspect ratio: 5:6 or 500x600).

### 2. Adding or Editing Projects
Open `index.html` and look for the `<!-- PROJECTS SHOWCASE -->` section. Each project is an `<article class="project-card">` block:

```html
<article class="project-card" data-category="web">
  <div class="project-thumb-container">
    <span class="project-category-badge">Web & Interactive</span>
    <img src="images/your-screenshot.png" alt="Project Name" class="project-thumb" />
  </div>
  <div class="project-body">
    <h3 class="project-title">Your Project Title</h3>
    <p class="project-desc">Brief description of your awesome creation.</p>
    <div class="project-tags">
      <span class="project-tag">HTML</span>
      <span class="project-tag">CSS</span>
    </div>
    <div class="project-actions">
      <button class="btn-inspect" type="button">Inspect Specimen</button>
      <a href="https://your-demo-url.com" class="btn-link-icon" title="Live Demo">...</a>
      <a href="https://github.com/your-username/repo" class="btn-link-icon" title="View Source">...</a>
    </div>
  </div>
</article>
```

### 3. Updating Your Links
In `index.html`, replace placeholder GitHub links (`https://github.com`) and email (`mailto:elijah@example.com`) with your actual handles.

---

## 🚀 Publishing to GitHub Pages (Step-by-Step)

1. **Create a GitHub Repository**:
   - Go to [GitHub.com](https://github.com) and create a new public repository (e.g., `portfolio` or `elijah-portfolio`).
   - *Tip:* If you name the repo `yourusername.github.io`, it will be published at your root domain!

2. **Push the Files to GitHub**:
   In your terminal, navigate to this folder and run:
   ```bash
   cd /Users/smcstudent/.gemini/antigravity/scratch/elijah-portfolio
   git init
   git add .
   git commit -m "Initial commit: Deep sea portfolio for 10C F26"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - On GitHub, go to your repository **Settings** → **Pages** (under the "Code and automation" sidebar).
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
   - Within 1–2 minutes, your deep sea portfolio will be live at `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`!

---

## 💡 Setting Active Workspace in Antigravity
To make this folder your active workspace in Antigravity, click **Open Folder** in the IDE and select:
`/Users/smcstudent/.gemini/antigravity/scratch/elijah-portfolio`
