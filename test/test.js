import assert from 'assert'
// import { stringify, parse } from '../src/search-params.js'
import { zipFiles } from '../src/jszip-files.js'

// function testStringify(it, params, expected) {
//   console.log('it', it)
//   assert.strictEqual(SearhParams.stringify(params), expected)
//   console.log(`\u001B[32m✓\u001B[39m ${expected}`)
// }

async function testParse(it, target, files, expected) {
  console.log('it', it)
  const result = await zipFiles(target, files)
  console.log()
  assert.strictEqual(result, expected)
  console.log(`\u001B[32m✓\u001B[39m ${expected}`)
}

testParse('zip files', 'aa.zip', ['a.docx', 'b.docx'], 'aa.zip')
testParse(
  'zip files',
  'd:/dd.zip',
  ['d:/a.docx', 'd:/b.docx', 'd:/tmp.pdf'],
  'd:/dd.zip'
)

console.log('done')
