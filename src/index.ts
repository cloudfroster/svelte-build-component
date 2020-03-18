import * as svelte from 'svelte'
import App from './app.svelte'

window.svelte = svelte

new App({
  target: document.querySelector('#app'),
  hydrate: true
});
