const EXTENSIONS_DATA = [
  {
    id: "nyaa",
    name: "Nyaa.si",
    version: "1.0.0",
    package: "nyaasearch",
    main: "sources/nyaa",
    speed: "moderate",
    accuracy: "medium",
    nsfw: false,
    regions: ["NL", "US"],
    description: "Public anime torrent indexer (Nyaa.si) RSS & search source for Shiru.",
    icon: "https://nyaa.si/static/favicon.png",
    shorthand: "gh:user/shiru-anime-extensions/nyaasearch"
  },
  {
    id: "sukebei",
    name: "Sukebei.moe",
    version: "1.0.0",
    package: "nyaasearch",
    main: "sources/sukebei",
    speed: "moderate",
    accuracy: "medium",
    nsfw: true,
    regions: ["LU", "DE"],
    description: "Adult anime torrent indexer (Sukebei.moe) search source for Shiru.",
    icon: "https://sukebei.nyaa.si/static/favicon.png",
    shorthand: "gh:user/shiru-anime-extensions/nyaasearch"
  },
  {
    id: "seadex",
    name: "SeaDex",
    version: "1.0.0",
    package: "anisearch",
    main: "sources/seadex",
    speed: "fast",
    accuracy: "high",
    nsfw: false,
    regions: ["US"],
    description: "SeaDex indexer (releases.moe) providing curated, highest-quality anime release torrents.",
    icon: "https://releases.moe/favicon.png",
    shorthand: "gh:user/shiru-anime-extensions/anisearch"
  },
  {
    id: "animetosho",
    name: "Anime Tosho",
    version: "1.0.0",
    package: "anisearch",
    main: "sources/tosho",
    speed: "fast",
    accuracy: "high",
    nsfw: false,
    regions: ["DE", "US"],
    description: "Automated torrent, DDL, & Usenet mirror for anime releases with full metadata search.",
    icon: "https://animetosho.org/favicon.ico",
    shorthand: "gh:user/shiru-anime-extensions/anisearch"
  },
  {
    id: "tsukihime",
    name: "TsukiHime",
    version: "1.0.0",
    package: "tsukisearch",
    main: "sources/tsuki",
    speed: "fast",
    accuracy: "high",
    nsfw: false,
    regions: ["US"],
    description: "TsukiHime anime torrent database API source with AniList/AniDB ID matching.",
    icon: "https://tsukihime.org/favicon.ico",
    shorthand: "gh:user/shiru-anime-extensions/tsukisearch"
  },
  {
    id: "nekobt",
    name: "nekoBT",
    version: "1.0.0",
    package: "nekosearch",
    main: "sources/nekobt",
    speed: "fast",
    accuracy: "high",
    nsfw: false,
    regions: ["JP", "US"],
    description: "nekoBT Japanese raw and subtitled anime torrent search API for Shiru.",
    icon: "https://nekobt.com/favicon.ico",
    shorthand: "gh:user/shiru-anime-extensions/nekosearch"
  },
  {
    id: "tokyotoshokan",
    name: "Tokyo Toshokan",
    version: "1.0.0",
    package: "tokyotoshokan",
    main: "sources/tokyo",
    speed: "fast",
    accuracy: "medium",
    nsfw: false,
    regions: ["US"],
    description: "Tokyo Toshokan library for anime torrents and Japanese media releases.",
    icon: "https://www.tokyotoshokan.org/favicon.ico",
    shorthand: "gh:user/shiru-anime-extensions/tokyotoshokan"
  },
  {
    id: "anidex",
    name: "AniDex",
    version: "1.0.0",
    package: "anidex",
    main: "sources/anidex",
    speed: "fast",
    accuracy: "medium",
    nsfw: false,
    regions: ["US", "NL"],
    description: "AniDex anime and media torrent indexer RSS and search source for Shiru.",
    icon: "https://anidex.info/favicon.ico",
    shorthand: "gh:user/shiru-anime-extensions/anidex"
  }
]

document.addEventListener('DOMContentLoaded', () => {
  setupTabs()
  setupSearchAndFilters()
  setupCopyButtons()
  setupTesterForm()
  renderExtensions(EXTENSIONS_DATA)
})

function setupTabs() {
  const navBtns = document.querySelectorAll('.nav-btn')
  const tabContents = document.querySelectorAll('.tab-content')

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab')

      navBtns.forEach(b => b.classList.remove('active'))
      tabContents.forEach(t => t.classList.remove('active'))

      btn.classList.add('active')
      document.getElementById(`tab-${targetTab}`).classList.add('active')
    })
  })
}

function renderExtensions(data) {
  const grid = document.getElementById('extensions-grid')
  grid.innerHTML = ''

  if (!data.length) {
    grid.innerHTML = `<div class="empty-state">No matching extensions found.</div>`
    return
  }

  data.forEach(ext => {
    const card = document.createElement('div')
    card.className = 'card'

    card.innerHTML = `
      <div class="card-header">
        <img class="ext-icon" src="${ext.icon}" alt="${ext.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📺</text></svg>'">
        <div class="ext-title">
          <h3>${ext.name}</h3>
          <span class="ext-ver">v${ext.version} &bull; ${ext.package}</span>
        </div>
      </div>

      <p class="card-desc">${ext.description}</p>

      <div class="meta-tags">
        <span class="meta-tag tag-speed">⚡ ${ext.speed}</span>
        <span class="meta-tag tag-accuracy">🎯 ${ext.accuracy} accuracy</span>
        ${ext.nsfw ? `<span class="meta-tag tag-nsfw">🔞 NSFW</span>` : ''}
        <span class="meta-tag">🌐 ${ext.regions.join(', ')}</span>
      </div>

      <div class="card-footer">
        <span style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted);">${ext.shorthand}</span>
        <button class="copy-link-btn" onclick="copyText('${ext.shorthand}')">Copy Source</button>
      </div>
    `

    grid.appendChild(card)
  })
}

function setupSearchAndFilters() {
  const searchInput = document.getElementById('search-input')
  const filterTags = document.querySelectorAll('.filter-tag')
  let currentFilter = 'all'

  const applyFilters = () => {
    const q = searchInput.value.toLowerCase()
    const filtered = EXTENSIONS_DATA.filter(ext => {
      const matchesSearch = ext.name.toLowerCase().includes(q) || ext.description.toLowerCase().includes(q) || ext.package.toLowerCase().includes(q)

      if (!matchesSearch) return false

      if (currentFilter === 'sfw') return !ext.nsfw
      if (currentFilter === 'high') return ext.accuracy === 'high'
      if (currentFilter === 'fast') return ext.speed === 'fast'
      return true
    })

    renderExtensions(filtered)
  }

  searchInput.addEventListener('input', applyFilters)

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'))
      tag.classList.add('active')
      currentFilter = tag.getAttribute('data-filter')
      applyFilters()
    })
  })
}

function setupCopyButtons() {
  const copyRepoBtn = document.getElementById('copy-repo-btn')
  const repoInput = document.getElementById('repo-url-input')

  if (copyRepoBtn) {
    copyRepoBtn.addEventListener('click', () => {
      copyText(repoInput.value)
      copyRepoBtn.textContent = '✅ Copied!'
      setTimeout(() => copyRepoBtn.textContent = '📋 Copy Link', 2000)
    })
  }
}

window.copyText = function(text) {
  navigator.clipboard.writeText(text)
  alert(`Copied to clipboard:\n${text}`)
}

function setupTesterForm() {
  const form = document.getElementById('tester-form')
  const resultsList = document.getElementById('results-list')
  const countBadge = document.getElementById('results-count')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const titles = document.getElementById('test-titles').value.split(',').map(t => t.trim()).filter(Boolean)
    const episode = parseInt(document.getElementById('test-episode').value, 10)
    const resolution = document.getElementById('test-resolution').value
    const mode = document.getElementById('test-mode').value
    const selectedSource = document.getElementById('test-source').value

    resultsList.innerHTML = `<div class="empty-state">Querying simulation engine...</div>`

    // Generate mock simulated results representing live extension query
    setTimeout(() => {
      const mockResults = [
        {
          title: `[SubsPlease] ${titles[0] || 'Anime'} - ${episode.toString().padStart(2, '0')} (${resolution || '1080p'}) [1289A012].mkv`,
          seeders: 342,
          leechers: 12,
          size: "1.4 GiB",
          source: "Nyaa.si",
          hash: "a4f89d1234567890abcdef1234567890abcdef12"
        },
        {
          title: `[Erai-raws] ${titles[0] || 'Anime'} - ${episode.toString().padStart(2, '0')} [${resolution || '1080p'}][Multiple Subtitle].mkv`,
          seeders: 198,
          leechers: 5,
          size: "1.2 GiB",
          source: "SeaDex (Best Quality)",
          hash: "b9876543210fedcba9876543210fedcba9876543"
        },
        {
          title: `[Judas] ${titles[0] || 'Anime'} - ${episode.toString().padStart(2, '0')} [HEVC 10bit ${resolution || '1080p'}][Dual-Audio].mkv`,
          seeders: 89,
          leechers: 2,
          size: "450 MiB",
          source: "AnimeTosho",
          hash: "c11223344556677889900aabbccddeeff001122"
        }
      ]

      countBadge.textContent = `${mockResults.length} torrents found`
      resultsList.innerHTML = ''

      mockResults.forEach(res => {
        const item = document.createElement('div')
        item.className = 'result-item'
        item.innerHTML = `
          <div>
            <div class="result-title">${res.title}</div>
            <div class="result-meta">
              <span>Source: <strong>${res.source}</strong></span>
              <span>Size: ${res.size}</span>
              <span>Seeders: 🟢 ${res.seeders}</span>
              <span>Leechers: 🔴 ${res.leechers}</span>
            </div>
          </div>
          <button class="copy-link-btn" onclick="copyText('magnet:?xt=urn:btih:${res.hash}')">Copy Magnet</button>
        `
        resultsList.appendChild(item)
      })
    }, 400)
  })
}
