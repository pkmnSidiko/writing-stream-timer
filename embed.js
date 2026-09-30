const TLC_EMBED = (() => {
  const params = new URLSearchParams(location.search);
  const viewer = params.has("viewer");
  const embed = params.has("embed");

  function applyMode() {
    if (viewer) document.body.classList.add("viewer");
    if (embed) document.body.classList.add("embed");
  }

  function url(mode = "") {
    const result = new URL(location.href);
    result.search = mode ? `?${mode}` : "";
    result.hash = "";
    return result.href;
  }

  return {
    viewer,
    embed,
    isDisplayMode: viewer || embed,
    applyMode,
    url
  };
})();
