document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selections ---
  const textarea = document.getElementById("text-input");
  const charCountSpan = document.getElementById("char-count");
  const maxCharSpan = document.getElementById("max-char");
  const wordCountSpan = document.getElementById("word-count");
  const readingTimeSpan = document.getElementById("reading-time");
  const counterStatus = document.getElementById("status-info"); // Now includes all text stats
  const copyButton = document.getElementById("copy-button");
  const clearButton = document.getElementById("clear-button");
  const progressBar = document.getElementById("progress-bar");

  // --- Configuration / Constants ---
  // Get the maximum length from the textarea's maxlength attribute
  const maxLength = parseInt(textarea.getAttribute("maxlength"), 10) || 200;
  // Average words per minute for reading time calculation
  const WORDS_PER_MINUTE = 200; // Standard average reading speed

  // Set the max character display initially
  maxCharSpan.textContent = maxLength;

  // --- Core Functions ---

  /**
   * Updates the character count, word count, reading time, and visual indicators.
   */
  const updateCounter = () => {
    const text = textarea.value;
    const currentLength = text.length;

    // 1. Update Character Count
    charCountSpan.textContent = currentLength;

    // 2. Update Word Count
    // Split by whitespace, filter out empty strings (e.g., from multiple spaces)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    wordCountSpan.textContent = wordCount;

    // 3. Update Reading Time
    const readingTimeMinutes = wordCount > 0 ? Math.ceil(wordCount / WORDS_PER_MINUTE) : 0;
    readingTimeSpan.textContent = readingTimeMinutes;

    // 4. Dynamic Styling and Progress Bar Update
    const percentage = (currentLength / maxLength) * 100;
    progressBar.style.width = `${percentage}%`;

    // Reset classes for progress bar and textarea
    progressBar.classList.remove("near-limit", "limit-reached");
    textarea.classList.remove("limit-reached");

    // Define color thresholds
    let newBodyBg = "#00cc6a"; // Default green
    let counterTextColor = "#008040"; // Default counter text color

    if (currentLength >= maxLength * 0.9 && currentLength < maxLength) { // Nearing limit (e.g., 90-99%)
      newBodyBg = "#f39c12"; // Orange
      counterTextColor = "#e67e22"; // Orange for counter text
      progressBar.classList.add("near-limit");
    } else if (currentLength >= maxLength) { // At or over limit (100% or more)
      newBodyBg = "#e74c3c"; // Red
      counterTextColor = "#c0392b"; // Red for counter text
      progressBar.classList.add("limit-reached");
      textarea.classList.add("limit-reached"); // Add class for red border on textarea
    }
    // Apply background color to body (smooth transition handled by CSS)
    document.body.style.backgroundColor = newBodyBg;
    // Apply color to character count text
    charCountSpan.style.color = counterTextColor;


    // 5. Accessibility Enhancement: Live Region Updates
    // Update aria-live region for screen readers to announce changes
    let ariaLiveMessage = `${currentLength} of ${maxLength} characters. ${wordCount} words.`;

    if (currentLength < maxLength && (maxLength - currentLength) <= 10 && (maxLength - currentLength) > 0) {
      counterStatus.setAttribute("aria-live", "assertive"); // Be more assertive for last few chars
      ariaLiveMessage += ` ${maxLength - currentLength} characters remaining.`;
    } else if (currentLength >= maxLength) {
      counterStatus.setAttribute("aria-live", "assertive"); // Be assertive when limit is reached
      ariaLiveMessage += ` Character limit reached.`;
    } else {
      counterStatus.setAttribute("aria-live", "polite"); // Default polite
    }
    // Update the text content of the aria-live region for screen readers
    // Only update if the message content actually changes, to avoid excessive announcements.
    if (counterStatus.getAttribute("aria-label") !== ariaLiveMessage) {
        counterStatus.setAttribute("aria-label", ariaLiveMessage);
    }
  };

  /**
   * Copies the textarea content to the clipboard.
   */
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
      copyButton.textContent = "Copied!"; // Visual feedback
      setTimeout(() => {
        copyButton.textContent = "Copy Text"; // Reset button text
      }, 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers or if permission is denied
      // You could also add a more user-friendly error message here
      alert("Failed to copy text. Please copy manually.");
    }
  };

  /**
   * Clears the textarea content.
   */
  const clearText = () => {
    textarea.value = ""; // Clear the text
    updateCounter(); // Call updateCounter to reset all counts and styles
    textarea.focus(); // Keep focus on the textarea for immediate typing
  };

  // --- Event Listeners ---

  // Listen for input changes in the textarea
  textarea.addEventListener("input", updateCounter);

  // Listen for click on Copy button
  copyButton.addEventListener("click", copyText);

  // Listen for click on Clear button
  clearButton.addEventListener("click", clearText);

  // --- Initial Setup ---
  // Call updateCounter once on page load to initialize all displays (important if text area has default content)
  updateCounter();
});