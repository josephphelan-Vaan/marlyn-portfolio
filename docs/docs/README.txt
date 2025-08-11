Simple static portfolio for architect Marlyn Rivera.

How to run
- Open index.html directly in a browser (no build or server required).

Add a new project
1) Create a folder under projects/ using a short slug, e.g. projects/river-house/
2) Add images into that folder. Name a lead image (e.g. hero.jpg).
3) Open projects.json and add a new entry following this shape:
   {
     "slug": "river-house",
     "title": "River House",
     "year": 2024,
     "hero": "./projects/river-house/hero.jpg",
     "images": [
       "./projects/river-house/hero.jpg",
       "./projects/river-house/01.jpg"
     ]
   }
   - Alt text is taken from title.
   - Put the most representative image first.

Notes
- Keep image files optimized (JPEG ~75–85 quality, ~1600–2200px wide).
- The homepage shows up to 6 items from projects.json.
- projects.html shows all items and opens a lightbox (Esc / ← / →, click backdrop to close).
- If opening via file:// blocks fetching projects.json, the pages fall back to inline empty data to avoid console errors.

Resume placeholders
- Update email, city, and CV path in about.html/contact.html.
- Place a PDF at resume/Marlyn_Rivera_CV.pdf and a headshot at resume/photo.jpg (optional).
