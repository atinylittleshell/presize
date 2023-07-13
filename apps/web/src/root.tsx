import './global.css';

import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import mixpanel from 'mixpanel-browser';

import { ImageSelectorContextProvider } from './components/ImageSelectorContext';
import { RouterHead } from './components/router-head/router-head';

export default component$(() => {
  useVisibleTask$(() => {
    mixpanel.init('2f752955b5617a881da886ed2f8db165', { track_pageview: true, persistence: 'localStorage' });
  });

  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body class="flex flex-col h-screen bg-base-100" lang="en">
        <ImageSelectorContextProvider>
          <RouterOutlet />
        </ImageSelectorContextProvider>
      </body>
    </QwikCityProvider>
  );
});
