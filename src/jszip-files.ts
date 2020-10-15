import JSZip from 'jszip'
import * as fs from 'fs'
import { basename } from 'path'

async function fileExists(filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    return fs.access(filePath, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

async function readContent(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    return fs.readFile(
      filePath,
      (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}

async function writeContent(filePath: string, data: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    return fs.writeFile(filePath, data, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function zipFiles(resultName: string, files: string[]) {
  return new Promise(async (resolve, reject) => {
    const zip = new JSZip()
    Promise.all(files.map((v) => fileExists(v)))
      .then(async (_) => {
        console.log('all exists')

        for (const file of files) {
          console.log('add', file)
          const content = await readContent(file)
          zip.file(basename(file), content, { binary: true })
        }
      })
      .then((_) => {
        zip
          .generateAsync({ type: 'nodebuffer' })
          .then(async (content) => {
            await writeContent(resultName, content)
            resolve(resultName)
          })
          .catch((err: NodeJS.ErrnoException | null) => {
            reject(err)
          })
      })
      .catch((err: NodeJS.ErrnoException | null) => {
        reject(err)
      })
  })
}
