require('dotenv').config()
const { spawn } = require('child_process')
const { version } = require('./package.json')

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', cwd: __dirname })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} exited with code ${code}`))
    })
  })
}

async function main() {
  const options = new Set(process.argv.slice(2))
  for (const option of options) {
    if (!['--push', '--no-cache'].includes(option)) {
      throw new Error(`Unknown option: ${option}. Supported: --push, --no-cache`)
    }
  }
  const registry = process.env.DOCKER_REGISTRY
  const name = process.env.DOCKER_IMAGE_NAME
  if (!registry || !name) throw new Error('Set DOCKER_REGISTRY and DOCKER_IMAGE_NAME in .env.')
  const image = `${registry}/${name}:${version}`
  const platforms = 'linux/amd64,linux/arm64'

  await runCommand('npm', ['run', 'build:prod'])
  const args = ['buildx', 'build', '--platform', platforms, '--pull', '-t', image]
  if (process.env.DOCKER_BUILDER) args.push('--builder', process.env.DOCKER_BUILDER)
  if (options.has('--no-cache')) args.push('--no-cache')
  if (options.has('--push')) args.push('--push')
  args.push('.')
  await runCommand('docker', args)
  if (options.has('--push')) {
    await runCommand('docker', ['buildx', 'imagetools', 'inspect', image])
    console.log(`Published ${image} for ${platforms}`)
  } else {
    console.log(`Built ${image} in the builder cache. Run npm run deploy to publish.`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
