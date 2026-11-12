module.exports = {
  apps: [
    {
      name: "rpglobal-api",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "512M",
      autorestart: true,
      watch: false,
      time: true,
      merge_logs: true,
      out_file: "./logs/api-out.log",
      error_file: "./logs/api-error.log",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
