import JSZip from 'jszip'
import * as fs from 'fs'
import * as path from 'path'

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

export async function zipFiles(
  target: string,
  files: string[]
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const zip = new JSZip()
    try {
      await Promise.all(files.map((v) => fileExists(v)))
      for (const file of files) {
        console.log('add', file)
        const content = await readContent(file)
        zip.file(path.basename(file), content, { binary: true })
      }
      const content = await zip.generateAsync({ type: 'nodebuffer' })
      await writeContent(target, content)
      resolve(target)
    } catch (error: any) {
      switch (error.code) {
        case 'ENOENT':
          console.error(`file ${error.path} does not exists`)
          break
        default:
          console.error('zip files failed')
          break
      }
      reject(error)
    }
  })
}
