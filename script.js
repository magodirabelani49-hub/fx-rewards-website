const APP_URL = 'https://app.fxrewards.co.za/';
const INSTAGRAM_URL = 'https://www.instagram.com/fx_rewards/';

const RATES = {
  forex: { label: 'Forex & Gold', rate: 7 },
  indices: { label: 'Indices', rate: 75 }
};

const lotsInput = document.querySelector('#lots');
const rewardOutput = document.querySelector('#reward-output');
const rateLabel = document.querySelector('#rate-label');
const metaLabel = document.querySelector('#meta-label');
const metaRate = document.querySelector('#meta-rate');
const metaLots = document.querySelector('#meta-lots');
const calcTabs = [...document.querySelectorAll('.calc-tab')];
let currentCategory = 'forex';

function clampLots(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0.01) return 0.01;
  return Math.round(parsed * 100) / 100;
}

function currency(value) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function singularLot(value) {
  return `${value.toFixed(2)} lot${value === 1 ? '' : 's'}`;
}

function updateCalculator() {
  const lots = clampLots(lotsInput.value);
  const rate = RATES[currentCategory].rate;
  const reward = lots * rate;

  lotsInput.value = lots.toFixed(2);
  rewardOutput.textContent = currency(reward);
  rateLabel.textContent = RATES[currentCategory].label;
  metaLabel.textContent = RATES[currentCategory].label;
  metaRate.textContent = `$${rate} per 1.00 lot`;
  metaLots.textContent = singularLot(lots);
}

lotsInput?.addEventListener('input', updateCalculator);
lotsInput?.addEventListener('blur', updateCalculator);

document.querySelectorAll('.lot-step').forEach(button => {
  button.addEventListener('click', () => {
    const change = Number(button.dataset.step || 0);
    const next = clampLots(Number(lotsInput.value) + change);
    lotsInput.value = next.toFixed(2);
    updateCalculator();
  });
});

calcTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    currentCategory = tab.dataset.category;
    calcTabs.forEach(btn => {
      const active = btn === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    updateCalculator();
  });
});

document.querySelectorAll('[data-auth="join"]').forEach(link => {
  link.href = APP_URL;
});

document.querySelectorAll('[data-auth="login"]').forEach(link => {
  link.href = APP_URL;
});

document.querySelectorAll(`a[href^="https://www.instagram.com/fx_rewards"]`).forEach(link => {
  link.href = INSTAGRAM_URL;
});

document.querySelector('#year').textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileNav?.classList.toggle('is-open', !isOpen);
  mobileNav?.setAttribute('aria-hidden', String(isOpen));
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileNav?.classList.remove('is-open');
    mobileNav?.setAttribute('aria-hidden', 'true');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

updateCalculator();
