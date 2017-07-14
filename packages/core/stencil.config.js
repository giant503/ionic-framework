exports.config = {
  namespace: 'Ionic',
  buildDest: 'dist',
  staticBuildDir: '/dist',
  generateCollection: true,
  diagnosticsDest: 'demos/.dev-diagnostics.html',
  bundles: [
    { components: ['ion-app', 'ion-content', 'ion-footer', 'ion-header', 'ion-navbar', 'ion-page', 'ion-title', 'ion-toolbar'] },
    { components: ['ion-avatar', 'ion-badge', 'ion-thumbnail'] },
    { components: ['ion-button', 'ion-buttons', 'ion-icon'] },
    { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title'] },
    { components: ['ion-gesture', 'ion-scroll'], priority: 'low' },
    { components: ['ion-item', 'ion-item-divider', 'ion-label', 'ion-list', 'ion-list-header', 'ion-skeleton-text'] },
    { components: ['ion-loading', 'ion-loading-controller'] },
    { components: ['ion-menu'], priority: 'low' },
    { components: ['ion-modal', 'ion-modal-controller'] },
    { components: ['ion-searchbar'] },
    { components: ['ion-segment', 'ion-segment-button'] },
    { components: ['ion-slides', 'ion-slide'] },
    { components: ['ion-spinner'] },
    { components: ['ion-toggle'] }
  ],
  preamble: '(C) Ionic http://ionicframework.com - MIT License'
};
