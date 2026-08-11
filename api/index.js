// Vercel zero-config entrypoint: any file under /api at the project root
// becomes a Serverless Function. This one just re-exports the NestJS
// serverless handler that `nest build` compiles into apps/api/dist during
// the project's buildCommand (see vercel.json).
module.exports = require('../apps/api/dist/serverless.js').default;
