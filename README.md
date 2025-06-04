# warcraftlogs-search

[![Powered by Vercel](https://badgen.net/badge/vercel/warcraftlogs-search/black?icon=zeit)](https://wcl.nulldozzer.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Tool for finding logs using certain talents and/or items

Whenever you are developing modules for the great [WowAnalyzer](https://wowanalyzer.com/),
you often find yourself looking for a log of a player using a niche talent or item so that
you can verify if your code is detecting the events as appropriate.

To help myself with this, I wrote this tool that fetches logs from Warcraftlogs, and allows
filtering by talents and items.

The code is not great, it was put together as a utility rather than as a service.

## Install

```bash
npm install
```

## Development

```
npm run dev
```

## Deployment

Deployed automagically using [Vercel](https://vercel.com/)

[https://wcl.nulldozzer.io/](https://wcl.nulldozzer.io/)

## License

ISC © Oscar Busk
