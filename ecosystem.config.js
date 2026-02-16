module.exports = {
  apps: [{
    name: 'ctogram',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: './',
    env: {
      PORT: 8001,
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    time: true
  }]
} 