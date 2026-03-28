export function createCustomSelect(id, groups, defaultValue){
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select';
  wrapper.dataset.id = id;

  const display = document.createElement('button');
  display.className = 'cs-display';
  display.type = 'button';

  const dropdown = document.createElement('div');
  dropdown.className = 'cs-dropdown';

  let currentValue = defaultValue || '';
  let currentLabel = '';
  let isDisabled = false;

  groups.forEach(g => {
    if(g.label){
      const groupLabel = document.createElement('div');
      groupLabel.className = 'cs-group-label';
      groupLabel.textContent = g.label;
      dropdown.appendChild(groupLabel);
    }
    (g.options || g.keys || []).forEach(opt => {
      const item = document.createElement('button');
      item.className = 'cs-item';
      item.type = 'button';
      const val = opt.value || opt.root || opt;
      const label = opt.label || opt.name || opt;
      item.dataset.value = val;
      item.textContent = label;
      if(val === currentValue){
        item.classList.add('active');
        currentLabel = label;
      }
      item.addEventListener('click', (e) => {
        if(isDisabled) return;
        e.stopPropagation();
        currentValue = val;
        currentLabel = label;
        display.textContent = label;
        dropdown.querySelectorAll('.cs-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        wrapper.classList.remove('open');
        wrapper.dispatchEvent(new CustomEvent('change', {detail:{value:val}}));
      });
      dropdown.appendChild(item);
    });
  });

  display.textContent = currentLabel || currentValue;
  wrapper.appendChild(display);
  wrapper.appendChild(dropdown);

  display.addEventListener('click', (e) => {
    if(isDisabled) return;
    e.stopPropagation();
    document.querySelectorAll('.custom-select.open').forEach(s => {
      if(s !== wrapper) s.classList.remove('open');
    });
    wrapper.classList.toggle('open');
  });

  document.addEventListener('click', () => wrapper.classList.remove('open'));

  wrapper.getValue = () => currentValue;
  wrapper.setValue = (val) => {
    currentValue = val;
    const item = dropdown.querySelector(`[data-value="${val}"]`);
    if(item){ currentLabel = item.textContent; display.textContent = currentLabel; }
    dropdown.querySelectorAll('.cs-item').forEach(i => i.classList.toggle('active', i.dataset.value === val));
  };
  wrapper.setDisabled = (nextDisabled) => {
    isDisabled = Boolean(nextDisabled);
    display.disabled = isDisabled;
    wrapper.classList.toggle('is-disabled', isDisabled);
    wrapper.setAttribute('aria-disabled', String(isDisabled));
    if(isDisabled){
      wrapper.classList.remove('open');
    }
  };
  wrapper.isDisabled = () => isDisabled;

  return wrapper;
}
