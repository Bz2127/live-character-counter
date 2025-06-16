document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("text-input");
  const charCountSpan = document.getElementById("char-count");
  const maxCharSpan = document.getElementById("max-char");
  const wordCountSpan = document.getElementById("word-count");
  const readingTimeSpan = document.getElementById("reading-time");
  const counterStatus = document.getElementById("status-info");
  const copyButton = document.getElementById("copy-button");
  const clearButton = document.getElementById("clear-button");
  const progressBar = document.getElementById("progress-bar");

  const maxLength = parseInt(textarea.getAttribute("maxlength"), 10) || 200;
  const WORDS_PER_MINUTE = 200;

  maxCharSpan.textContent = maxLength;

  const updateCounter = () => {
    const text = textarea.value;
    const currentLength = text.length;

    charCountSpan.textContent = currentLength;

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    wordCountSpan.textContent = wordCount;

    const readingTimeMinutes = wordCount > 0 ? Math.ceil(wordCount / WORDS_PER_MINUTE) : 0;
    readingTimeSpan.textContent = readingTimeMinutes;

    const percentage = (currentLength / maxLength) * 100;
    progressBar.style.width = `${percentage}%`;

    progressBar.classList.remove("near-limit", "limit-reached");
    textarea.classList.remove("limit-reached");

    let newBodyBg = "#00cc6a";
    let counterTextColor = "#008040";

    if (currentLength >= maxLength * 0.9 && currentLength < maxLength) {
      newBodyBg = "#f39c12";
      counterTextColor = "#e67e22";
      progressBar.classList.add("near-limit");
    } else if (currentLength >= maxLength) {
      newBodyBg = "#e74c3c";
      counterTextColor = "#c0392b";
      progressBar.classList.add("limit-reached");
      textarea.classList.add("limit-reached");
    }
    document.body.style.backgroundColor = newBodyBg;
    charCountSpan.style.color = counterTextColor;

    let ariaLiveMessage = `${currentLength} of ${maxLength} characters. ${wordCount} words.`;

    if (currentLength < maxLength && (maxLength - currentLength) <= 10 && (maxLength - currentLength) > 0) {
      counterStatus.setAttribute("aria-live", "assertive");
      ariaLiveMessage += ` ${maxLength - currentLength} characters remaining.`;
    } else if (currentLength >= maxLength) {
      counterStatus.setAttribute("aria-live", "assertive");
      ariaLiveMessage += ` Character limit reached.`;
    } else {
      counterStatus.setAttribute("aria-live", "polite");
    }
    if (counterStatus.getAttribute("aria-label") !== ariaLiveMessage) {
        counterStatus.setAttribute("aria-label", ariaLiveMessage);
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy Text";
      }, 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text. Please copy manually.");
    }
  };

  const clearText = () => {
    textarea.value = "";
    updateCounter();
    textarea.focus();
  };

  textarea.addEventListener("input", updateCounter);
  copyButton.addEventListener("click", copyText);
  clearButton.addEventListener("click", clearText);

  updateCounter();
});