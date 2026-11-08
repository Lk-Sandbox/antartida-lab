import { mount } from 'svelte';
import '@antartida/core/styles/index.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });
