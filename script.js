// Replace with the card number linked to the student account
const VALID_CARD_NUMBER = "4111111111111111";

const tabButtons = document.querySelectorAll(".tab-btn");
const netbankingPanel = document.getElementById("netbanking-panel");
const cardPanel = document.getElementById("card-panel");
const cardForm = document.getElementById("card-form");
const cardNumberInput = document.getElementById("card-number");
const expiryInput = document.getElementById("expiry");
const cardError = document.getElementById("card-error");
const cardSuccess = document.getElementById("card-success");

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
    showError("not link to student account");
    return;
  }

  showSuccess("Payment successful! Your fee has been recorded (demo).");
  cardForm.reset();
});
