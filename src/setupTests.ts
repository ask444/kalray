// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import ResizeObserverModule from 'resize-observer-polyfill';

(global as any).ResizeObserver = ResizeObserverModule;

window._env_ = {
    PUBLIC_URL: '/',
    API_ROOT_URL: '/api',
};
