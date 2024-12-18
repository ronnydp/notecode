// Cargar el cargador de módulos de Monaco
require.config({
  paths: { vs: "https://unpkg.com/monaco-editor@0.52.0/min/vs" },
});
document.addEventListener("DOMContentLoaded", async () => {
  require(["vs/editor/editor.main"], function () {
    const editorDiv = document.getElementById("editor");

    const code = editorDiv.getAttribute("data-code");
    const language = editorDiv.getAttribute("data-language");
    const theme = editorDiv.getAttribute("data-theme");

    document.body.classList.add(theme);
    document.getElementById("share-button").disabled = true;
    document.getElementById("share-button").classList.add("disabled");
    document.getElementById("languageDropdown").disabled = true;
    document.getElementById("languageDropdown").classList.add("disabled");
    document.getElementById("themeDropdown").disabled = true;
    document.getElementById("themeDropdown").classList.add("disabled");
    document.getElementById("linkContainer").style.display = "flex";
    document.getElementById("linkshare").textContent = window.location.href;

    const scrollbarOptions = {
      vertical: "auto",
      horizontal: "hidden",
      verticalScrollbarSize: 3,
      horizontalScrollbarSize: 3,
      handleMouseWheel: true,
      alwaysConsumeMouseWheel: true,
    };
    window.editor = monaco.editor.create(document.getElementById("editor"), {
      language: language,
      minimap: {
        enabled: true,
      },
      scrollbar: scrollbarOptions,
      automaticLayout: true,
      wordWrap: "on",
      theme: theme,
      value: code,
    });

    
  //*LANGUAGES
  const currentLanguage = editor.getModel().getLanguageId();
  const content_languages_dropdown = document.getElementById("languages");
  const input_language = document.getElementById("languageDropdown");

  input_language.value = currentLanguage.toUpperCase();
  function setLanguage(lang) {
    const model = editor.getModel();
    monaco.editor.setModelLanguage(model, lang);
  }

  function getCurrentLanguage() {
    const currentLanguage = editor.getModel().getLanguageId();
    return currentLanguage;
  }

  content_languages_dropdown.addEventListener("click", (e) => {
    const languageToChange = e.target.innerText.toLowerCase();
    setLanguage(languageToChange);
    input_language.textContent = getCurrentLanguage().toUpperCase();
  });

  //* THEME
  const content_themes_dropdown = document.getElementById("themes");
  const input_theme = document.getElementById("themeDropdown");
  const currentTheme = editor._themeService.getColorTheme().id;

  input_theme.value = currentTheme.toUpperCase();

  content_themes_dropdown.addEventListener("click", (e) => {
    const themeToChange = e.target.innerText.toLowerCase();
    monaco.editor.setTheme(themeToChange);
    input_theme.textContent = currentTheme.toUpperCase();
  });

  // const knownThemes = ["vs", "vs-dark", "hc-light", "hc-black"];
  const knownThemes = ["vs", "vs-dark"];
  themes = editor._themeService._knownThemes;

  themes.forEach((theme) => {
    if (knownThemes.includes(theme.id)) {
      const option = document.createElement("div");
      option.textContent = theme.id;
      option.classList.add("option");
      option.addEventListener("click", () => {
        const itemText = option.textContent;
        input_theme.value = itemText;

        // Cambiar el tema del editor
        document.body.classList.remove("vs-dark", "hc-black");

        if (itemText === "vs-dark") {
          document.body.classList.add("vs-dark");
        }
        if (itemText === "hc-black") {
          document.body.classList.add("hc-black");
        }
      });
      content_themes_dropdown.appendChild(option);
    }
  });

    //* ajustar MINIMAP segun el dispositivo
    function adjustMinimap() {
      const width = window.innerWidth;
      const minimapEnabled = width > 1024;
      if (editor) {
        editor.updateOptions({
          minimap: {
            enabled: minimapEnabled,
          },
        });
      }
    }

    //En tiempo real
    window.addEventListener("resize", adjustMinimap);
    function adjustEditorSize() {
      const editorWidth = document.getElementById("editor").clientWidth;
      const editorHeight = document.getElementById("editor").clientHeight;
      if (editor) {
        editor.layout({
          width: editorWidth,
          height: editorHeight,
        });
      }
    }
    window.addEventListener("resize", adjustEditorSize);
    adjustEditorSize();

    /* SHARE */
    const shareButton = document.getElementById("share-button");
    const linkContainer = document.getElementById("linkContainer");
    shareButton.addEventListener("click", () => {
      if ((linkContainer.style.display = "none")) {
        // guardar estado del editor
        const state = {
          code: editor.getValue(),
          language: currentLanguage,
          theme: currentTheme,
          scrollbar: scrollbarOptions,
        };

        // actualizar estado del editor
        function updateState() {
          state.code = editor.getValue();
          state.language = editor.getModel().getLanguageId();
          state.theme = editor._themeService.getColorTheme().id;
          return state;
        }
        async function sendData() {
          try {
            // Recibir datos al servidor
            const response = await fetch("/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateState()),
            });
            if (!response.ok) {
              throw new Error("Network error");
            }
            const data = await response.json();
            const newUrl = `${window.location.origin}/${data}`;
            const linkshare = document.getElementById("linkshare");
            linkshare.textContent = newUrl;

            window.location.href = newUrl;
          } catch (error) {
            console.error("Error", error);
          }
        }
        sendData();
      }
      shareButton.disabled = !shareButton.disabled;
      shareButton.style.backgroundColor = "#69758a";
      shareButton.style.cursor = "default";
    });

    /* COPY LINK */
    document.getElementById("linkContainer").addEventListener("click", () => {
      const Url = document.getElementById("linkshare").textContent;
      navigator.clipboard
        .writeText(Url)
        .then(() => {
          alert("Copied link");
        })
        .catch((err) => {
          alert("Error: " + err);
        });
    });

    /* ESCUHAR EVENTO CAMBIOS EN EL EDITOR & HABILITAR BOTONES */
    editor.onDidChangeModelContent(function () {
      document.getElementById("share-button").disabled = false;
      document.getElementById("share-button").classList.remove("disabled");
      document.getElementById("languageDropdown").disabled = false;
      document.getElementById("languageDropdown").classList.remove("disabled");
      document.getElementById("themeDropdown").disabled = false;
      document.getElementById("themeDropdown").classList.remove("disabled");
    });
  });
});
