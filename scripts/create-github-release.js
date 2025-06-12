#!/usr/bin/env node

/**
 * Modern GitHub Release Creator
 * 
 * This script creates GitHub releases using the GitHub CLI as a more reliable
 * alternative to the outdated conventional-github-releaser package.
 * 
 * Features:
 * - Uses GitHub CLI for reliable release creation
 * - Generates release notes from conventional commits
 * - Fallback to conventional-github-releaser for backward compatibility
 * - Better error handling and logging
 */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  preset: 'angular',
  generateNotes: true,
  latest: true,
  debug: process.env.DEBUG === 'true' || process.env.DEBUG === 'conventional-github-releaser'
};

// Repository URL configuration
const REPO_URL = process.env.GITHUB_REPOSITORY
  ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
  : 'https://github.com/rudderlabs/rudder-transformer';

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function execCommand(command, options = {}) {
  try {
    if (CONFIG.debug) {
      log(`Executing: ${command}`, 'info');
    }
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: CONFIG.debug ? 'inherit' : 'pipe',
      ...options 
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.message, 
      output: error.stdout || error.stderr || '' 
    };
  }
}



function getPreviousTag(currentTag) {
  // Get all tags sorted by version
  const result = execCommand('git tag --sort=-version:refname');
  if (!result.success) {
    log('Could not get tags, using v0.0.0', 'warn');
    return 'v0.0.0';
  }

  const tags = result.output.trim().split('\n').filter(tag => tag.trim());
  const currentIndex = tags.indexOf(currentTag);

  if (currentIndex === -1 || currentIndex === tags.length - 1) {
    // Current tag not found or is the oldest tag
    return tags[tags.length - 1] || 'v0.0.0';
  }

  return tags[currentIndex + 1];
}

function getVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    log(`Error reading package.json: ${error.message}`, 'error');
    process.exit(1);
  }
}

function generateConventionalReleaseNotes(version) {
  log(`Generating conventional release notes for v${version}...`);

  // Get the previous tag
  const currentTag = `v${version}`;
  const previousTag = getPreviousTag(currentTag);
  log(`Previous tag: ${previousTag}, Current tag: ${currentTag}`);

  // Get commits between previous tag and current version
  const commitRange = `${previousTag}..${currentTag}`;
  const result = execCommand(`git log ${commitRange} --pretty=format:"%s" --no-merges`);

  if (!result.success) {
    log(`Failed to get commits: ${result.error}`, 'error');
    return null;
  }

  const commits = result.output.trim().split('\n').filter(line => line.trim());

  // Parse commits according to Angular convention
  const features = [];
  const fixes = [];
  const breaking = [];
  const other = [];

  commits.forEach(commit => {
    const match = commit.match(/^(?<type>\w+)(?<scope>\(.+\))?\!?:\s*(?<description>.+)$/);
    if (match) {
      const { type, scope, description } = match.groups;
      const isBreaking = commit.includes('!:');

      if (isBreaking) {
        breaking.push(`* ${description}${scope ? ` ${scope}` : ''}`);
      } else if (type === 'feat') {
        features.push(`* ${description}${scope ? ` ${scope}` : ''}`);
      } else if (type === 'fix') {
        fixes.push(`* ${description}${scope ? ` ${scope}` : ''}`);
      } else {
        other.push(`* ${type}${scope || ''}: ${description}`);
      }
    } else {
      other.push(`* ${commit}`);
    }
  });

  // Build release notes
  let releaseNotes = `# Release v${version}\n\n`;

  if (breaking.length > 0) {
    releaseNotes += `## ⚠ BREAKING CHANGES\n\n${breaking.join('\n')}\n\n`;
  }

  if (features.length > 0) {
    releaseNotes += `## 🚀 Features\n\n${features.join('\n')}\n\n`;
  }

  if (fixes.length > 0) {
    releaseNotes += `## 🐛 Bug Fixes\n\n${fixes.join('\n')}\n\n`;
  }

  if (other.length > 0) {
    releaseNotes += `## 🔧 Other Changes\n\n${other.join('\n')}\n\n`;
  }

  releaseNotes += `**Full Changelog**: ${REPO_URL}/compare/${previousTag}...v${version}`;

  return releaseNotes;
}

function createReleaseWithGitHubCLI(version) {
  log(`Creating release v${version} using GitHub CLI...`);

  // Generate conventional release notes
  const releaseNotes = generateConventionalReleaseNotes(version);

  let command;
  let tempFile = null;
  let tempDir = null;

  if (releaseNotes) {
    // Create secure temporary file
    try {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-notes-'));
      tempFile = path.join(tempDir, `${version}-${crypto.randomBytes(4).toString('hex')}.md`);
      fs.writeFileSync(tempFile, releaseNotes);
      command = [
        'gh', 'release', 'create', `v${version}`,
        '--title', `v${version}`,
        '--notes-file', tempFile
      ];
    } catch (error) {
      log(`Failed to write release notes file: ${error.message}`, 'error');
      // Fallback to generate-notes
      command = [
        'gh', 'release', 'create', `v${version}`,
        '--title', `v${version}`,
        '--generate-notes'
      ];
    }
  } else {
    // Fallback to GitHub's auto-generated notes
    command = [
      'gh', 'release', 'create', `v${version}`,
      '--title', `v${version}`,
      '--generate-notes'
    ];
  }

  if (CONFIG.latest) {
    command.push('--latest');
  }

  const result = execCommand(command.join(' '));

  // Clean up temporary files
  if (tempFile && tempDir) {
    try {
      fs.unlinkSync(tempFile);
      fs.rmdirSync(tempDir);
    } catch (e) {
      // Log but don't fail
      log(`Failed to clean up temp file: ${e.message}`, 'warn');
    }
  }

  if (result.success) {
    log(`Release v${version} created successfully with GitHub CLI`);
    return true;
  } else {
    log(`❌ GitHub CLI failed: ${result.error}`, 'error');
    if (result.output) {
      log(`Output: ${result.output}`, 'error');
    }
    return false;
  }
}

function createReleaseWithConventionalReleaser(version) {
  log(`Creating release v${version} using conventional-github-releaser...`);
  
  const command = 'DEBUG=conventional-github-releaser npx conventional-github-releaser -p angular --config github-release.config.js';
  const result = execCommand(command);
  
  if (result.success) {
    log(`Release v${version} created successfully with conventional-github-releaser`);
    return true;
  } else {
    log(`❌ conventional-github-releaser failed: ${result.error}`, 'error');
    if (result.output) {
      log(`Output: ${result.output}`, 'error');
    }
    return false;
  }
}

function main() {
  log('Starting GitHub release creation process...');
  
  // Get version from package.json
  const version = getVersion();
  log(`Target version: ${version}`);
  
  // Check if tag exists
  const tagResult = execCommand(`git rev-parse --verify v${version}`);
  if (!tagResult.success) {
    log(`Tag v${version} does not exist. Please create the tag first.`, 'error');
    process.exit(1);
  }

  // Check if release already exists
  log(`Checking if release v${version} already exists...`);
  const releaseCheckResult = execCommand(`gh release view v${version}`);
  if (releaseCheckResult.success) {
    log(`✅ Release v${version} already exists. Skipping creation.`, 'warn');
    log(`🔗 Existing release: https://github.com/rudderlabs/rudder-transformer/releases/tag/v${version}`);
    process.exit(0);
  } else {
    log(`Release v${version} does not exist. Proceeding with creation...`);
  }
  
  // Try GitHub CLI first (modern approach)
  if (createReleaseWithGitHubCLI(version)) {
    log('🎉 Release created successfully!');
    process.exit(0);
  }
  
  // Fallback to conventional-github-releaser
  log('Falling back to conventional-github-releaser...');
  if (createReleaseWithConventionalReleaser(version)) {
    log('🎉 Release created successfully with fallback method!');
    process.exit(0);
  }
  
  // Both methods failed
  log('❌ All release creation methods failed', 'error');
  process.exit(1);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createReleaseWithGitHubCLI,
  createReleaseWithConventionalReleaser,
  generateConventionalReleaseNotes,
  getPreviousTag,
  getVersion
};
