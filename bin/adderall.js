#!/usr/bin/env node
// adderall — dosage-based meta-skill pack
// (c) adhdcreator — MIT License
import('../src/cli.js')
  .then(({ main }) => main(process.argv.slice(2)))
  .catch((err) => {
    process.stderr.write(`adderall: ${err.stack || err.message || err}\n`);
    process.exit(1);
  });
