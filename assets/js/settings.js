import { state } from './sorting/state.js';

export function initSettings() {
  //settings object to hold current values (Used later)
  /*const settings = {
    theme:        'dark',
    audioEnabled: true,
    volume:       0.8,
    waveform:     'sine',
  };*/
 
  //declared DOM elements
  const btn = document.getElementById('settings-btn');
  const menu = document.getElementById('settings-menu');
  const wrapper = document.getElementById('settings-wrapper');
 
  //open/close menu functions
  function openMenu() {
    btn.classList.add('open');
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
 
  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  //
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  //Close menu when clicking outside
  wrapper.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  //Choose waveform
  const waveformSelect = document.getElementById('waveform-select');
  waveformSelect.addEventListener('change', (e) => {
    const selectedWaveform = e.target.value;
    state.waveform = selectedWaveform; //Update global state
    closeMenu();
    console.log(`Waveform set to: ${selectedWaveform}`);
  });

  //Choose volume
  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');
  
  volumeSlider.addEventListener('input', (e) => {
    const selectedVolume = e.target.value / 100;
    if (selectedVolume === 0) {
      state.audioEnabled = false; //Disable audio if volume is 0
      volumeIcon.classList.remove('fa-volume-high');
      volumeIcon.classList.add('fa-volume-mute');
    }
    if (!state.audioEnabled && selectedVolume > 0) {
      state.audioEnabled = true; //Re-enable audio if volume is increased from 0
      volumeIcon.classList.add('fa-volume-high');
      volumeIcon.classList.remove('fa-volume-mute');
    }
    state.volume = selectedVolume; //Update global state
    console.log(`Volume set to: ${selectedVolume}`);
  });

  volumeIcon.addEventListener('click', () => {
    if (state.audioEnabled) {
      state.audioEnabled = false;
      volumeIcon.classList.remove('fa-volume-high');
      volumeIcon.classList.add('fa-volume-mute');
      volumeSlider.value = 0;
    } else {
      state.audioEnabled = true;
      volumeIcon.classList.add('fa-volume-high');
      volumeIcon.classList.remove('fa-volume-mute');
      volumeSlider.value = state.volume * 100;
    }
    closeMenu();
    console.log(`Audio enabled: ${state.audioEnabled}`);
  });
}