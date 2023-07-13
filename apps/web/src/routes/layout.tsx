import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to one day stale
    staleWhileRevalidate: 60 * 60 * 24,
    // Max once every 5 minutes, revalidate on the server to get a fresh version of this page
    maxAge: 300,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <main class="flex-1 flex flex-col overflow-y-auto">
      <Slot />
    </main>
  );
});
