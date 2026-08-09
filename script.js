// Replace with the card number linked to the student account
const VALID_CARD_NUMBER = "4191880111251498";
const LOADING_DURATION_SEC = 15;

const tabButtons = document.querySelectorAll(".tab-btn");
const netbankingPanel = document.getElementById("netbanking-panel");
const cardPanel = document.getElementById("card-panel");
const cardForm = document.getElementById("card-form");
const cardNumberInput = document.getElementById("card-number");
const expiryInput = document.getElementById("expiry");
const cardError = document.getElementById("card-error");
const cardSuccess = document.getElementById("card-success");
const payBtn = cardForm.querySelector(".pay-btn");

const loadingOverlay = document.getElementById("loading-overlay");
const loadingCountdown = document.getElementById("loading-countdown");
const otpOverlay = document.getElementById("otp-overlay");
const otpForm = document.getElementById("otp-form");
const otpInput = document.getElementById("otp-input");
const otpError = document.getElementById("otp-error");
const otpSuccess = document.getElementById("otp-success");
const otpCancelBtn = document.getElementById("otp-cancel");

let loadingTimerId = null;

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    netbankingPanel.classList.toggle("active", tab === "netbanking");
    cardPanel.classList.toggle("active", tab === "card");
  });
});

function normalizeCardNumber(value) {
  return value.replace(/\s+/g, "").replace(/-/g, "");
}

function formatCardNumber(value) {
  const digits = normalizeCardNumber(value).replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

cardNumberInput.addEventListener("input", (e) => {
  e.target.value = formatCardNumber(e.target.value);
});

expiryInput.addEventListener("input", (e) => {
  e.target.value = formatExpiry(e.target.value);
});

otpInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
});

function showError(message) {
  cardError.textContent = message;
  cardError.hidden = false;
  cardSuccess.hidden = true;
}

function showSuccess(message) {
  cardSuccess.textContent = message;
  cardSuccess.hidden = false;
  cardError.hidden = true;
}

function hideMessages() {
  cardError.hidden = true;
  cardSuccess.hidden = true;
}

function showOtpError(message) {
  otpError.textContent = message;
  otpError.hidden = false;
  otpSuccess.hidden = true;
}

function showOtpSuccess(message) {
  otpSuccess.textContent = message;
  otpSuccess.hidden = false;
  otpError.hidden = true;
}

function hideOtpMessages() {
  otpError.hidden = true;
  otpSuccess.hidden = true;
}

function clearLoadingTimer() {
  if (loadingTimerId !== null) {
    clearInterval(loadingTimerId);
    loadingTimerId = null;
  }
}

function showLoadingScreen() {
  let secondsLeft = LOADING_DURATION_SEC;
  loadingCountdown.textContent = String(secondsLeft);
  loadingOverlay.hidden = false;
  payBtn.disabled = true;

  clearLoadingTimer();
  loadingTimerId = setInterval(() => {
    secondsLeft -= 1;
    loadingCountdown.textContent = String(Math.max(secondsLeft, 0));

    if (secondsLeft <= 0) {
      clearLoadingTimer();
      loadingOverlay.hidden = true;
      openOtpPopup();
    }
  }, 1000);
}

function openOtpPopup() {
  otpInput.value = "";
  hideOtpMessages();
  otpOverlay.hidden = false;
  otpInput.focus();
  payBtn.disabled = false;
}

function closeOtpPopup() {
  otpOverlay.hidden = true;
  hideOtpMessages();
}

otpCancelBtn.addEventListener("click", closeOtpPopup);

otpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideOtpMessages();

  const otp = otpInput.value.trim();
  if (otp.length !== 6) {
    showOtpError("Please enter a valid 6-digit OTP.");
    return;
  }

  showOtpSuccess("Payment successful! Your fee has been recorded (demo).");
  setTimeout(() => {
    closeOtpPopup();
    cardForm.reset();
    hideMessages();
  }, 1500);
});

cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideMessages();

  const cardNumber = normalizeCardNumber(cardNumberInput.value);
  const cardName = document.getElementById("card-name").value.trim();
  const expiry = expiryInput.value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (!cardNumber || !cardName || !expiry || !cvv) {
    showError("Please fill in all card details.");
    return;
  }

  if (cardNumber !== VALID_CARD_NUMBER) {
    showError("Card number is not linked to your student account.");
    return;
  }

  showLoadingScreen();
});
