# ftp-nanny

## Tasks

### npm run sync

Analyse remote filesystem and take a snapshot of the medias tree. Operate
a diff with database known medias, add news and tag missing as removed.

>$ npm run sync

### npm run push

Retrieve medias added/removed in last 24h and send them by email.

>$ npm run push

### npm run purge

Cleanup MongoDB cache collection with entries older than 7 days.

>$ npm run purge

### npm run build

Build production bundles.

>$ npm run build

## Server

Serve frontend pages, client and REST API.

>$ npm start
