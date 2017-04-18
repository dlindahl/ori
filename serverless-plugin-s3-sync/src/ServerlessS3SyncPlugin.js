const find = require('lodash.find');
const fs = require('fs');
const getFiles = require('./getFiles');
const intersection = require('lodash.intersection');
const mime = require('mime');
const minimatch = require('minimatch');
const mkdirp = require('mkdirp');
const path = require('path');

let AWS = null;
let BUCKET = null;
let CLI = null;
let CONFIG = null;
let FILES = null;
let SLS = null;

class ServerlessS3SyncPlugin {
  constructor(serverless) {
    AWS = serverless.getProvider('aws');
    CLI = serverless.cli;
    SLS = serverless;
    this.commands = {
      s3: {
        commands: {
          down: {
            usage: 'Downloads files specified in serverless.yml to S3',
            lifecycleEvents: ['sync']
          },
          up: {
            usage: 'Uploads files specified in serverless.yml to S3',
            lifecycleEvents: ['sync']
          }
        }
      }
    };
    this.hooks = {
      's3:down:sync': this.syncDown.bind(this),
      's3:up:sync': this.syncUp.bind(this)
    };
  }
  get bucket() {
    BUCKET = BUCKET || this.config.bucket;
    if (!BUCKET) {
      throw new Error('Missing custom:s3:bucket definition in serverless.yml');
    }
    return BUCKET;
  }
  get config() {
    CONFIG = CONFIG || SLS.variables.service.custom.s3;
    if (!CONFIG) {
      throw new Error('Missing custom:s3 definition in serverless.yml');
    }
    return CONFIG;
  }
  createBucket() {
    CLI.log(`Checking for existence of "${this.bucket}"...`);
    return this.validateBucket().then(
      () => {
        CLI.log(`  "${this.bucket}" found`);
        return Promise.resolve();
      },
      () => {
        const err = new Error(
          `S3 Bucket "${this.bucket}" not found! You may need to deploy your serverless app to create it.`
        );
        return Promise.reject(err);
      }
    );
  }
  download() {
    const patterns = getFiles.globPattern(
      this.config.include,
      this.config.exclude
    );
    return this.remoteFiles()
      .then(files => files.map(file => file.Key))
      .then(files => {
        /*
         * The logic here may very well be wrong. globby uses union, but when
         * running similar logic manually, union was including files
         * specifically excluded by "!" patterns.
         */
        const matches = patterns.map(pattern => {
          return minimatch.match(files, pattern, {
            dot: true
          });
        });
        return intersection.apply(null, matches);
      })
      .then(files => {
        const downloads = files.map(file => {
          CLI.log(`  Downloading ${file}`);
          return this.downloadFile(file).then(() => {
            CLI.log(`  Saved ${file} successfully`);
          });
        });
        return Promise.all(downloads);
      })
      .catch(err => {
        throw err;
      });
  }
  downloadFile(file) {
    const filepath = path.join(SLS.config.servicePath, file);
    const dirname = path.dirname(filepath);
    const params = {
      Bucket: this.bucket,
      Key: file
    };
    return AWS.request('S3', 'getObject', params, this.stage, this.region)
      .then(data => {
        return new Promise((resolve, reject) => {
          // Ensure the local directory exists before attempting to write to it
          mkdirp(dirname, err => {
            if (err) {
              return reject(err);
            }
            return resolve(data);
          });
        });
      })
      .then(data => {
        return new Promise((resolve, reject) => {
          fs.writeFile(filepath, data.Body, err => {
            if (err) {
              return reject(err);
            }
            return resolve(data);
          });
        });
      });
  }
  get files() {
    return (FILES = FILES ||
      getFiles(SLS, this.config.include, this.config.exclude));
  }
  get region() {
    return this.config.region || SLS.service.provider.region;
  }
  get stage() {
    return this.config.stage || SLS.service.provider.stage;
  }
  remoteFiles() {
    return AWS.request(
      'S3',
      'listObjects',
      {
        Bucket: this.bucket
      },
      this.stage,
      this.region
    ).then(data => {
      return data.Contents;
    });
  }
  syncDown() {
    this.validateRemote().then(this.download.bind(this)).then(() => {
      CLI.log('Successfully synced from S3!');
    });
  }
  syncUp() {
    this.validateLocal();
    this.createBucket().then(this.upload.bind(this)).then(() => {
      CLI.log('Successfully synced to S3!');
    });
  }
  upload() {
    CLI.log(`Uploading ${this.files.length} file(s)...`);
    const uploads = this.files.map(file => {
      return new Promise((resolve, reject) => {
        fs.stat(file, (err, stats) => {
          if (err) {
            reject(err);
          }
          if (stats.isDirectory()) {
            CLI.log(
              `  ${file} is a directory, skipping. Add ${file}/** to include directories.`
            );
            return resolve();
          }
          return this.uploadFile(file).then(resolve, reject);
        });
      });
    });
    return Promise.all(uploads);
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, buffer) => {
        if (err) {
          return reject(err);
        }
        const key = file
          .replace(SLS.config.servicePath, '')
          .substr(1)
          .replace('\\', '/');
        const params = {
          Body: buffer,
          Bucket: this.bucket,
          ContentType: mime.lookup(file),
          Key: key
        };
        CLI.log(`  Uploading ${key}`);
        AWS.request('S3', 'putObject', params, this.stage, this.region).then(
          resolve,
          reject
        );
      });
    });
  }
  validateBucket() {
    return AWS.request(
      'S3',
      'listBuckets',
      {},
      this.state,
      this.region
    ).then(data => {
      if (find(data.Buckets, { Name: this.bucket })) {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    });
  }
  validateLocal() {
    CLI.log('Validating files...');
    CLI.log(
      `  Parsing configuration ${JSON.stringify(this.config, [
        'include',
        'exclude'
      ])}`
    );
    CLI.log(`  Checking files exist in ${SLS.config.servicePath}`);
    if (!this.files.length) {
      throw new Error(
        'Could not find any files to sync! Please ensure the paths in your serverless.yml config exist in your project folder. If you are including an entire folder, use the correct globl syntax: myFolder/**. See https://serverless.com/framework/docs/providers/openwhisk/guide/packaging/#exclude--include for more information.'
      );
    }
  }
  validateRemote() {
    CLI.log('Validating S3 configuration...');
    return this.validateBucket().then(
      () => {
        CLI.log(`  ${this.bucket} found!`);
      },
      err => {
        if (err) {
          throw err;
        }
        const error = new Error(
          `S3 Bucket "${this.bucket} not found! You may need to deploy your serverless app to create it.`
        );
        return Promise.reject(error);
      }
    );
  }
}

module.exports = ServerlessS3SyncPlugin;
