const bindElements = document.querySelectorAll('*[data-bind]');
const bindMap = {};
const scope = {};

for (const el of bindElements) {
  const bindTo = el.dataset.bind;

  if (!bindMap[bindTo]) {
    bindMap[bindTo] = [];
  }

  bindMap[bindTo].push(el);
}

function bindValue(bindingName, value) {
  scope[bindingName] = value;
}

function syncBindings(target) {
  for (const bindTo in scope) {
    const value = scope[bindTo];

    for (const el of bindMap[bindTo]) {
      if (el !== target) {
        if (el.tagName === 'INPUT') {
          el.value = value;
        } else {
          el.textContent = value;
        }
      }
    }

    delete scope[bindTo];
  }
}

document.addEventListener(
  'input',
  (e) => {
    const target = e.target;
    const bindTo = target.dataset.bind;

    if (bindTo && bindMap[bindTo]) {
      bindValue(bindTo, target.value);

      if (bindingEnabled.checked) {
        syncBindings(target);
      }
    }
  },
  true
);

const bindingEnabled = document.querySelector('#bindingEnabled');

bindingEnabled.addEventListener('change', () => {
  if (bindingEnabled.checked) {
    syncBindings();
  }
});
