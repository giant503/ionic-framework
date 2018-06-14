const sass = require('@stencil/sass');

exports.config = {
  namespace: 'Ionic',
  bundles: [
    { components: ['ion-action-sheet', 'ion-action-sheet-controller'] },
    { components: ['ion-alert', 'ion-alert-controller'] },
    { components: ['ion-anchor', 'ion-back-button', 'ion-nav', 'ion-nav-pop', 'ion-nav-push', 'ion-nav-set-root'] },
    { components: ['ion-animation-controller'] },
    { components: ['ion-app', 'ion-buttons', 'ion-content', 'ion-footer', 'ion-header', 'ion-scroll', 'ion-tap-click', 'ion-title', 'ion-toolbar'] },
    { components: ['ion-avatar', 'ion-badge', 'ion-thumbnail'] },
    { components: ['ion-backdrop'] },
    { components: ['ion-button', 'ion-icon'] },
    { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title', 'ion-card-subtitle'] },
    { components: ['ion-checkbox'] },
    { components: ['ion-chip', 'ion-chip-button'] },
    { components: ['ion-datetime', 'ion-picker', 'ion-picker-column', 'ion-picker-controller'] },
    { components: ['ion-fab', 'ion-fab-button', 'ion-fab-list'] },
    { components: ['ion-gesture', 'ion-gesture-controller'] },
    { components: ['ion-grid', 'ion-row', 'ion-col'] },
    { components: ['ion-hide-when', 'ion-show-when'] },
    { components: ['ion-infinite-scroll', 'ion-infinite-scroll-content'] },
    { components: ['ion-input', 'ion-textarea'] },
    { components: ['ion-item', 'ion-item-divider', 'ion-item-group', 'ion-label', 'ion-list', 'ion-list-header', 'ion-skeleton-text'] },
    { components: ['ion-item-sliding', 'ion-item-options', 'ion-item-option'] },
    { components: ['ion-loading', 'ion-loading-controller'] },
    { components: ['ion-menu', 'ion-menu-controller', 'ion-menu-toggle', 'ion-menu-button'] },
    { components: ['ion-modal', 'ion-modal-controller'] },
    { components: ['ion-note', 'ion-img', 'ion-text'] },
    { components: ['ion-popover', 'ion-popover-controller'] },
    { components: ['ion-radio', 'ion-radio-group'] },
    { components: ['ion-range', 'ion-range-knob']},
    { components: ['ion-refresher', 'ion-refresher-content']},
    { components: ['ion-reorder', 'ion-reorder-group'] },
    { components: ['ion-ripple-effect'] },
    { components: ['ion-router', 'ion-route', 'ion-route-redirect', 'ion-router-outlet'] },
    { components: ['ion-searchbar'] },
    { components: ['ion-segment', 'ion-segment-button'] },
    { components: ['ion-select', 'ion-select-option', 'ion-select-popover'] },
    { components: ['ion-slides', 'ion-slide'] },
    { components: ['ion-spinner'] },
    { components: ['ion-split-pane'] },
    { components: ['ion-status-tap'] },
    { components: ['ion-tabs', 'ion-tab', 'ion-tabbar', 'ion-tab-button'] },
    { components: ['ion-toast', 'ion-toast-controller'] },
    { components: ['ion-toggle'] },
    { components: ['ion-virtual-scroll'] },
  ],
  plugins: [
    sass(),
  ],
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'stats',
      file: 'stats.json'
    }
  ],
  copy: [{ src: '**/*.scss' }],
  preamble: '(C) Ionic http://ionicframework.com - MIT License',
  globalScript: 'src/global/ionic-global.ts',
  enableCache: false,
};

exports.devServer = {
  root: '.',
  watchGlob: ['dist/*.*', 'dist/ionic/**/**', 'src/**/*.html']
};
