if (process.env.SKIP_PREPARE_SCRIPT === 'true') {
  process.exit(0);
} else {
  process.exit(1);
}
