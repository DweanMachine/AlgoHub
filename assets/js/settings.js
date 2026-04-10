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
 
  //open & close menu functions
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
  
  //Toggle menu on button click [not working??]
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  //Close menu when clicking outside
  wrapper.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      closeMenu();
    }
  });


  const darkTheme = document.getElementById('theme-dark');
  const lightTheme = document.getElementById('theme-light');
  const defaultTheme = document.getElementById('theme-default');
  darkTheme.addEventListener('click', (e) => {
    state.theme = 'dark'; //Update global state
    applyTheme(
      'rgb(12,12,28)',
      'rgb(220,224,248)',
      'rgb(100,108,168)',
      'rgb(60,65,110)',
      'rgb(10,125,35)',
      'rgb(165,10,10)',
      'aquamarine',
      'rgb(132, 132, 152)');
  });

  lightTheme.addEventListener('click', (e) => {
    state.theme = 'light'; //Update global state
    applyTheme(
      'rgb(120,120,160)',
      'rgb(28,28,65)',  
      'rgb(60,60,120)', 
      'rgb(90,90,140)',
      'rgb(105,185,105)',
      'rgb(205,100,100)',
      'rgb(60,110,110)',
      'rgb(52, 52, 52)');
  });

  defaultTheme.addEventListener('click', (e) => {
    state.theme = 'default'; //Update global state
    applyTheme(
      'rgb(35,35,80)', 
      'rgb(200,200,230)', 
      'rgb(150,150,180)', 
      'rgb(120,120,150)',
      'rgb(10,135,35)',
      'rgb(255,0,0)',
      'aquamarine',
      'rgb(100, 100, 130)');
  });

  function applyTheme(bgColor, color, primary, secondary, completed, swapping, title, barOutline) {
    TransitionEvent ? document.documentElement.style.transition = 'var(--background-color) 3s, var(--color) 3s' : null;
    document.documentElement.style.setProperty('--background-color', bgColor);
    document.documentElement.style.setProperty('--color', color);
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--completed', completed);
    document.documentElement.style.setProperty('--swapping', swapping);
    document.documentElement.style.setProperty('--title', title);
    document.documentElement.style.setProperty('--barOutline', barOutline);
  }

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