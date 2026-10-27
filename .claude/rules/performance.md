---
paths:
  - "app/**"
  - "lib/**"
---

# Performance

Every feature and every change to a page keeps these rules. Check them while building, and measure before calling the work done (see the end of this file).

General React and Next.js performance (no request waterfalls, parallel fetching, Suspense streaming, small client props, bundle size, re-renders) follows the `vercel-react-best-practices` skill; caching APIs (`"use cache"`, `cacheLife`, `cacheTag`) follow the Next.js docs bundled in `node_modules/next/dist/docs/`. This file adds only what they leave out.

## Show the page at once

- Await only what the top of the page needs; every other part streams in behind its own skeleton.
- Shared layouts await nothing. Data they share reaches client components as promises.
- Navigation is instant: the shell and skeletons come from the prefetch, the data streams in after.

## Load lists in batches

A list here is any repeated set of items: a row, a grid, a feed, a table.

### First batch

- Send the first batch with the page, about one screen of items. Load the next batch when the end of the list comes into view.
- Data already in memory is still rendered batch by batch. Never render hundreds of items at once.

### Next batches

- The next batches come from an API route. A client component never gets the whole collection.
- Fetch the next batch after the last item shown (a cursor), not by offset, so an item that leaves the list does not make another get skipped.
- Filter and sort on the server, in the same order for every batch. Changing a filter starts again from the first batch.
- When the data source answers in fixed pages, use its page as the batch.

### After a write

- When the server re-renders the page after a write (an item added or removed), the list starts again from the new first batch and drops what it had loaded and hidden.
- Counts and totals come from the server, never from the number of items loaded so far.

## Ask data sources for as little as possible

- Fetch only what is shown: a first page for a preview, the whole set only where all of it is used.
- Do not load data only to discard it. Skip what the caller already knows.
- Set each cache lifetime by how often that data changes: short for data that changes outside the app, long for data that barely changes. Cache an expensive aggregate as a whole, not only its parts.
- After a write, expire the cache tag of what changed instead of shortening the cache for everyone.

## Media

- When the media host already serves the needed sizes, load from it directly, with the size in the URL, not through an optimizing proxy.
- Only the first screen loads eagerly; the rest stays lazy.

## Measure before calling it done

In the browser check of the feature workflow, for each page the change touches:

- Time it twice, signed in: `curl -w "ttfb=%{time_starttransfer} total=%{time_total} size=%{size_download}"`. The first call is cold, the second warm. In dev a code edit can empty the cache, so cold numbers there are rough.
- Check in the browser that the top of the page shows before the slow parts, and that navigation is instant.
- Count what the page sends: items rendered and HTML size. Give the numbers before and after the change in the final message.
- Targets: warm page under 1 s, HTML under ~300 KB, no media requests through an optimizing proxy.
