
require(["vs/editor/editor.main"], function () {
  const languages = monaco.languages.getLanguages();
  const languagesOptions = document.getElementById("languages");

  const knownLanguages = [
    "plaintext",
    "abap",
    "apex",
    "azcli",
    "bat",
    "bicep",
    "cameligo",
    "clojure",
    "coffeescript",
    "c",
    "cpp", // C++
    "csharp", // C#
    "csp",
    "css",
    "cypher",
    "dart",
    "dockerfile",
    "ecl",
    "elixir",
    "flow9",
    "fsharp",
    "freemarker2",
    "go",
    "graphql",
    "handlebars",
    "hcl",
    "html",
    "ini",
    "java",
    "javascript", // JavaScript
    "julia",
    "kotlin",
    "less",
    "lexon",
    "lua",
    "liquid",
    "markdown", // Markdown
    "mysql", // SQL
    "objective-c",
    "pascal",
    "perl",
    "php", // PHP
    "powershell",
    "python", // Python
    "r", // R
    "ruby", // Ruby
    "rust", // Rust
    "scala", // Scala
    "shell", 
    "sql", // SQL
    "swift", // Swift
    "typescript", // TypeScript
    "xml", 
    "yaml" // YAML
];


  languages.forEach((lang) => {
    if (knownLanguages.includes(lang.id)) {
      const option = document.createElement("div");
      option.textContent = lang.id;
      option.classList.add("option");
      option.addEventListener("click", () => {
        const input = document.getElementById("languageDropdown");
        const selectLanguage = option.textContent;
        input.value = selectLanguage;
      });
      languagesOptions.appendChild(option);
    }
  });

  document
    .getElementById("languageDropdown")
    .addEventListener("click", function () {
      languagesOptions.classList.toggle("show");
    });

  window.addEventListener("click", (e) => {
    if (!e.target.matches("#languageDropdown")) {
      languagesOptions.classList.remove("show");
    }
  });

  const content_themes_dropdown = document.getElementById("themes");
  document
    .getElementById("themeDropdown")
    .addEventListener("click", function () {
      content_themes_dropdown.classList.toggle("show");
    });

  window.addEventListener("click", (e) => {
    if (!e.target.matches("#themeDropdown")) {
      content_themes_dropdown.classList.remove("show");
    }
  });
});
