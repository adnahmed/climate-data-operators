const { spawn } = require('child_process')
class CDODistributionBinary {
  constructor() {
  }

  getEnv() {
    return {}
  }

  getExecutable() {
    return 'cdo'
  }

  async cleanup() {
  }
}

class CDO {
  constructor(binary) {
    this.binary = binary || new CDODistributionBinary
  }

  exec(args) {
    return new Promise((resolve, reject) => {
      const env = this.binary.getEnv()
      const executable = this.binary.getExecutable()
      const output = "";
      const cdo = spawn(executable, args, { env })
      let result;
      cdo.stdout.on('data', (data) => {
        if (!result)
          result = data;
        else result += data;
      }
      );
      cdo.on('close', code => {
        if (code !== 0) {
          reject(`CDO failed with code ${code}`)
        } else {
          resolve(result.toString())
        }
      })

      cdo.stdout.pipe(process.stdout)
      cdo.stderr.pipe(process.stderr)
    })
  }
}

module.exports = CDO
