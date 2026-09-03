# Shiru Anime Extensions

Community-maintained extensions for the [Shiru App](https://shiru.app) providing access to top anime torrent sources.

## 📦 Extensions

| Extension | Sources | Speed | Accuracy | Description |
|-----------|---------|-------|----------|-------------|
| **nyaasearch** | Nyaa.si, Sukebei | Slow | Medium | Public anime torrent tracker with RSS feed search |
| **anisearch** | SeaDex, Anime Tosho | Fast–Moderate | High | Curated high-quality releases and automated torrent mirrors |
| **tsukisearch** | TsukiHime | Fast | High | Anime torrent database with AniList/AniDB/MAL ID matching |
| **nekosearch** | nekoBT | Fast | High | Anime torrent search with TVDB/IMDB mapping and language filtering |
| **tokyosearch** | Tokyo Toshokan | Moderate | Medium | Anime torrent listing aggregator with RSS support |
| **anidexsearch** | AniDex | Moderate | Medium | Anime and Japanese media torrent indexer |

## 🚀 Installation

### Add to Shiru App

1. Open the **Shiru App**
2. Go to **Settings** → **Extensions**
3. Click **Add Repository**
4. Enter the following URL:

```
gh:thephantom-developer/shiru-anime-extensions
```

5. The app will load all available extensions from this repository

### Install Individual Extensions

You can also add individual extensions:

```
gh:thephantom-developer/shiru-anime-extensions/nyaasearch
gh:thephantom-developer/shiru-anime-extensions/anisearch
gh:thephantom-developer/shiru-anime-extensions/tsukisearch
gh:thephantom-developer/shiru-anime-extensions/nekosearch
gh:thephantom-developer/shiru-anime-extensions/tokyosearch
gh:thephantom-developer/shiru-anime-extensions/anidexsearch
```

## 📂 Repository Structure

```
shiru-anime-extensions/
├── index.json              # Repository index (points to all extensions)
├── package.json            # NPM metadata
├── README.md               # This file
├── LICENSE                 # GPL-3.0 License
│
├── nyaasearch/             # Nyaa.si + Sukebei extension
│   ├── index.json          # Extension manifest
│   ├── package.json
│   └── sources/
│       ├── abstract.js     # Base class
│       ├── index.d.ts      # Type definitions
│       ├── types.d.ts      # Source-specific types
│       ├── utils.js        # RSS parsing utilities
│       ├── nyaa.js         # Nyaa.si source
│       └── sukebei.js      # Sukebei source
│
├── anisearch/              # SeaDex + Anime Tosho extension
│   ├── index.json
│   ├── package.json
│   └── sources/
│       ├── abstract.js
│       ├── index.d.ts
│       ├── types.d.ts
│       ├── seadex.js       # SeaDex (releases.moe) source
│       └── tosho.js        # Anime Tosho source
│
├── tsukisearch/            # TsukiHime extension
│   ├── index.json
│   ├── package.json
│   └── sources/
│       ├── abstract.js
│       ├── index.d.ts
│       ├── types.d.ts
│       ├── utils.js
│       └── tsuki.js        # TsukiHime source
│
├── nekosearch/             # nekoBT extension
│   ├── index.json
│   ├── package.json
│   └── sources/
│       ├── abstract.js
│       ├── index.d.ts
│       ├── types.d.ts
│       ├── utils.js
│       └── nekobt.js       # nekoBT source
│
├── tokyosearch/            # Tokyo Toshokan extension
│   ├── index.json
│   ├── package.json
│   └── sources/
│       ├── abstract.js
│       ├── index.d.ts
│       ├── utils.js
│       └── tokyo.js        # Tokyo Toshokan source
│
└── anidexsearch/           # AniDex extension
    ├── index.json
    ├── package.json
    └── sources/
        ├── abstract.js
        ├── index.d.ts
        ├── utils.js
        └── anidex.js       # AniDex source
```

## 🔧 Extension API

Each extension source implements the `TorrentSource` interface:

```typescript
class TorrentSource {
  single(query: TorrentQuery): Promise<TorrentResult[]>   // Single episode search
  batch(query: TorrentQuery): Promise<TorrentResult[]>    // Batch/complete series
  movie(query: TorrentQuery): Promise<TorrentResult[]>    // Movie search
  validate(): Promise<boolean>                             // Source availability check
}
```

## 📝 License

This project is licensed under the [GPL-3.0 License](LICENSE).

## 🤝 Contributing

1. Fork this repository
2. Create a new extension folder following the structure above
3. Implement the `TorrentSource` interface
4. Add your extension to the root `index.json`
5. Submit a pull request

## ⚠️ Disclaimer

This repository provides extensions for the Shiru App. The extensions are for educational purposes. Users are responsible for complying with their local laws regarding torrent usage.
