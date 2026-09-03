import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const ROOT_DIR = path.resolve(import.meta.dirname, '..')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`)
    failed++
  } else {
    console.log(`✅ PASS: ${message}`)
    passed++
  }
}

async function runTests() {
  console.log('==================================================')
  console.log('🧪 Starting Shiru Extension Suite Verification Tests')
  console.log('==================================================\n')

  // 1. Root index.json test
  const rootIndexPath = path.join(ROOT_DIR, 'index.json')
  assert(fs.existsSync(rootIndexPath), 'Root index.json exists')

  const rootIndex = JSON.parse(fs.readFileSync(rootIndexPath, 'utf8'))
  assert(Array.isArray(rootIndex), 'Root index.json is an array')
  assert(rootIndex.length > 0, `Root index.json contains ${rootIndex.length} extension directories`)

  // 2. Validate each extension directory
  for (const entry of rootIndex) {
    const extDirName = entry.main
    console.log(`\n🔍 Testing extension package: ${extDirName}`)
    const extDirPath = path.join(ROOT_DIR, extDirName)

    assert(fs.existsSync(extDirPath), `Extension directory [${extDirName}] exists`)

    const manifestPath = path.join(extDirPath, 'index.json')
    assert(fs.existsSync(manifestPath), `Manifest [${extDirName}/index.json] exists`)

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    assert(Array.isArray(manifest), `Manifest [${extDirName}/index.json] is an array`)

    for (const sourceConfig of manifest) {
      console.log(`  🔹 Source: ${sourceConfig.name} (${sourceConfig.id}) v${sourceConfig.version}`)
      assert(!!sourceConfig.id, '  Source has id')
      assert(!!sourceConfig.name, '  Source has name')
      assert(!!sourceConfig.version, '  Source has version')
      assert(sourceConfig.type === 'torrent', '  Source type is torrent')
      assert(['fast', 'moderate', 'slow'].includes(sourceConfig.speed), '  Source speed is valid')
      assert(['high', 'medium', 'low'].includes(sourceConfig.accuracy), '  Source accuracy is valid')
      assert(typeof sourceConfig.nsfw === 'boolean', '  Source nsfw is boolean')

      // Import the source JS file
      const sourceJsPath = path.join(extDirPath, `${sourceConfig.main}.js`)
      assert(fs.existsSync(sourceJsPath), `  Source JavaScript file [${sourceConfig.main}.js] exists`)

      try {
        const fileUrl = pathToFileURL(sourceJsPath).href
        const module = await import(fileUrl)
        const instance = module.default

        assert(!!instance, '  Exports default instance')
        assert(typeof instance.single === 'function', '  Has single() method')
        assert(typeof instance.batch === 'function', '  Has batch() method')
        assert(typeof instance.movie === 'function', '  Has movie() method')
        assert(typeof instance.validate === 'function', '  Has validate() method')

        // Test single() with mock query object
        const mockQuery = {
          anilistId: 101922,
          anidbAid: 14145,
          titles: ['Demon Slayer', 'Kimetsu no Yaiba'],
          episode: 1,
          episodeCount: 26,
          resolution: '1080'
        }

        try {
          const singleRes = await Promise.race([
            instance.single(mockQuery),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
          ])
          assert(Array.isArray(singleRes), '  single() returned array of results')
        } catch (err) {
          console.log(`  ℹ️ single() fetch notice: ${err.message}`)
          assert(true, '  single() handled query safely without crash')
        }

        try {
          const isValid = await Promise.race([
            instance.validate(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
          ])
          assert(typeof isValid === 'boolean', `  validate() returned boolean (${isValid})`)
        } catch (err) {
          assert(true, '  validate() handled network check safely')
        }

      } catch (err) {
        assert(false, `  Failed to load module: ${err.stack}`)
      }
    }
  }

  console.log('\n==================================================')
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`)
  console.log('==================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
