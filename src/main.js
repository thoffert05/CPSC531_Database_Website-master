import './app.css';
import { mount } from 'svelte';
import App from './Dashboard.svelte';

mount(App, { target: document.getElementById('app') ?? document.body });
