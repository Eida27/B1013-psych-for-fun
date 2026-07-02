const fs = require("fs");
const path = require("path");

const root = __dirname;

const pages = [
  "index.html",
  "case-studies.html",
  "trivia.html",
  "story-library.html",
  "about.html",
];

const navLinks = [
  'href="index.html"',
  'href="case-studies.html"',
  'href="trivia.html"',
  'href="story-library.html"',
  'href="about.html"',
];

function readRequired(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function assertIncludes(source, expected, label) {
  if (!source.includes(expected)) {
    throw new Error(`${label} should include: ${expected}`);
  }
}

for (const page of pages) {
  const html = readRequired(page);
  assertIncludes(html, "Psych for Fun", `${page} brand`);
  assertIncludes(html, 'href="assets/styles.css"', `${page} stylesheet`);
  assertIncludes(
    html,
    'rel="icon" type="image/png" href="assets/psych-for-fun-logo.png"',
    `${page} favicon`
  );
  assertIncludes(
    html,
    '<img class="brand-logo" src="assets/psych-for-fun-logo.png" alt="" />',
    `${page} header logo`
  );
  assertIncludes(html, 'src="assets/site.js"', `${page} script`);

  for (const link of navLinks) {
    assertIncludes(html, link, `${page} navigation`);
  }
}

const home = readRequired("index.html");
assertIncludes(
  home,
  "Psychology stories that explain why people act the way they do.",
  "homepage hero headline"
);
assertIncludes(home, 'href="story-library.html"', "homepage primary CTA");
assertIncludes(
  home,
  'src="assets/hero-psychology-stories.png"',
  "homepage hero image"
);
assertIncludes(
  home,
  'alt="Editorial illustration of layered psychology stories and human behavior clues"',
  "homepage hero image alt text"
);

const caseStudies = readRequired("case-studies.html");
const caseCardCount = (caseStudies.match(/class="story-card story-card-case"/g) || [])
  .length;
if (caseCardCount < 3) {
  throw new Error("case-studies.html should include at least 3 case study cards");
}

const trivia = readRequired("trivia.html");
const triviaCount = (trivia.match(/class="trivia-item"/g) || []).length;
if (triviaCount < 6) {
  throw new Error("trivia.html should include at least 6 trivia items");
}

const library = readRequired("story-library.html");
const libraryCount = (library.match(/class="library-card"/g) || []).length;
if (libraryCount < 6) {
  throw new Error("story-library.html should include at least 6 library cards");
}

const about = readRequired("about.html");
assertIncludes(
  about,
  "Psych for Fun is educational storytelling, not therapy or medical advice.",
  "about disclaimer"
);

const css = readRequired("assets/styles.css");
assertIncludes(css, ".site-header", "shared CSS");
assertIncludes(css, "@media (max-width: 760px)", "responsive CSS");

const js = readRequired("assets/site.js");
assertIncludes(js, "data-nav-toggle", "mobile navigation JavaScript");

const heroPath = path.join(root, "assets", "hero-psychology-stories.png");
if (!fs.existsSync(heroPath)) {
  throw new Error("Missing required file: assets/hero-psychology-stories.png");
}

const logoPath = path.join(root, "assets", "psych-for-fun-logo.png");
if (!fs.existsSync(logoPath)) {
  throw new Error("Missing required file: assets/psych-for-fun-logo.png");
}

console.log("Static site smoke test passed.");
