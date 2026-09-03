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
  console.log('🧪 Verifying Shiru Extension Suite (Flat Architecture)')
  console.log('==================================================\n')

  const rootIndexPath = path.join(ROOT_DIR, 'index.json')
  assert(fs.existsSync(rootIndexPath), 'Root index.json exists')

  const rootIndex = JSON.parse(fs.readFileSync(rootIndexPath, 'utf8'))
  assert(Array.isArray(rootIndex), 'Root index.json is an array')
  assert(rootIndex.length === 8, `Root index.json contains all ${rootIndex.length} sources`)

  for (const sourceConfig of rootIndex) {
    console.log(`\n🔹 Testing Source: ${sourceConfig.name} (${sourceConfig.id}) v${sourceConfig.version}`)
    assert(!!sourceConfig.id, '  Has id')
    assert(!!sourceConfig.name, '  Has name')
    assert(!!sourceConfig.version, '  Has version')
    assert(sourceConfig.type === 'torrent', '  Type is torrent')
    assert(typeof sourceConfig.main === 'string', '  Main path defined')

    const sourceJsPath = path.join(ROOT_DIR, sourceConfig.main)
    assert(fs.existsSync(sourceJsPath), `  Source JS file [${sourceConfig.main}] exists`)

    try {
      const fileUrl = pathToFileURL(sourceJsPath).href
      const module = await import(fileUrl)
      const instance = module.default

      assert(!!instance, '  Exports default instance')
      assert(typeof instance.single === 'function', '  Has single() method')
      assert(typeof instance.batch === 'function', '  Has batch() method')
      assert(typeof instance.movie === 'function', '  Has movie() method')
      assert(typeof instance.validate === 'function', '  Has validate() method')

      const isValid = await instance.validate()
      assert(isValid === true, `  validate() returns true (${isValid})`)

      const mockQuery = {
        anilistId: 101922,
        anidbAid: 14145,
        titles: ['Demon Slayer', 'Kimetsu no Yaiba'],
        episode: 1
      }

      const singleRes = await instance.single(mockQuery)
      assert(Array.isArray(singleRes), '  single() returns array without throwing errors')

    } catch (err) {
      assert(false, `  Failed to execute module: ${err.message}`)
    }
  }

  console.log('\n==================================================')
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`)
  console.log('==================================================')

  if (failed > 0) process.exit(1)
}

runTests()
