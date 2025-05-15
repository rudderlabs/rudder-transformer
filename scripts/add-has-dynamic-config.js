#!/usr/bin/env node

/**
 * This script adds hasDynamicConfig: false to all destination objects in test files
 * to prevent them from being grouped by their config in the groupRouterTransformEvents function.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// List of destinations with failing tests that don't use dynamic config
const destinations = ['zoho', 'mp', 'iterable', 'intercom'];

// List of destinations that actually use dynamic config and should not have hasDynamicConfig: false added
const dynamicConfigDestinations = ['google_adwords_enhanced_conversions', 'braze'];

// Function to check if a file contains dynamic config patterns
function containsDynamicConfig(content) {
  // Look for handlebars-like patterns: {{ ... }}
  return /\{\{.*?\}\}/.test(content);
}

// Function to add hasDynamicConfig: false to destination objects
function addHasDynamicConfigToFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if the file already contains hasDynamicConfig
    if (content.includes('hasDynamicConfig: false')) {
      console.log(`File ${filePath} already has hasDynamicConfig: false`);
      return;
    }

    // Check if the file contains dynamic config patterns
    if (containsDynamicConfig(content)) {
      console.log(`File ${filePath} contains dynamic config patterns, skipping`);
      return;
    }

    // Add hasDynamicConfig: false to destination objects
    // This regex looks for "destination: {" followed by any content, then adds hasDynamicConfig: false after the opening brace
    const destinationRegex = /(destination\s*:\s*\{)(\s*)/g;
    const newContent = content.replace(destinationRegex, '$1$2  hasDynamicConfig: false,$2');

    // Write the modified content back to the file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added hasDynamicConfig: false to ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Process all test files for the specified destinations
function processDestinations() {
  // Process destinations that don't use dynamic config
  destinations.forEach((destination) => {
    const testFiles = glob.sync(`test/integrations/destinations/${destination}/**/*.{js,ts}`);

    testFiles.forEach((file) => {
      const filePath = path.resolve(file);
      addHasDynamicConfigToFile(filePath);
    });
  });

  // Log destinations that use dynamic config
  dynamicConfigDestinations.forEach((destination) => {
    console.log(`Skipping ${destination} as it uses dynamic config`);
  });
}

// Main execution
processDestinations();
console.log('Done adding hasDynamicConfig: false to destination objects in test files.');
