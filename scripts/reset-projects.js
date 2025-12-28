#!/usr/bin/env node

/**
 * Script to reset project versions and remove changelogs.
 * This script:
 * 1. Sets all package.json versions to 0.0.0
 * 2. Deletes all CHANGELOG.md files
 * 3. Resets .release-please-manifest.json versions to 0.0.0
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * Find all package.json files in the project
 * @returns {string[]} Array of package.json file paths
 */
function findPackageJsonFiles() {
  const packageJsonFiles = [];

  function searchDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules and dist directories
      if (
        entry.isDirectory() &&
        (entry.name === 'node_modules' || entry.name === 'dist')
      ) {
        continue;
      }

      if (entry.isFile() && entry.name === 'package.json') {
        packageJsonFiles.push(fullPath);
      } else if (entry.isDirectory()) {
        searchDirectory(fullPath);
      }
    }
  }

  searchDirectory(PROJECT_ROOT);
  return packageJsonFiles;
}

/**
 * Find all CHANGELOG.md files in the project
 * @returns {string[]} Array of CHANGELOG.md file paths
 */
function findChangelogFiles() {
  const changelogFiles = [];

  function searchDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules and dist directories
      if (
        entry.isDirectory() &&
        (entry.name === 'node_modules' || entry.name === 'dist')
      ) {
        continue;
      }

      if (entry.isFile() && entry.name === 'CHANGELOG.md') {
        changelogFiles.push(fullPath);
      } else if (entry.isDirectory()) {
        searchDirectory(fullPath);
      }
    }
  }

  searchDirectory(PROJECT_ROOT);
  return changelogFiles;
}

/**
 * Reset version in a package.json file
 * @param {string} filePath - Path to package.json file
 */
function resetVersion(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);

    // Only update if version exists
    if (packageJson.version !== undefined) {
      packageJson.version = '0.0.0';

      // Write back with proper formatting (2 spaces indentation)
      fs.writeFileSync(
        filePath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf8',
      );

      const relativePath = path.relative(PROJECT_ROOT, filePath);
      console.log(`✓ Reset version to 0.0.0 in ${relativePath}`);
    } else {
      const relativePath = path.relative(PROJECT_ROOT, filePath);
      console.log(`⊘ No version field found in ${relativePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Delete a CHANGELOG.md file
 * @param {string} filePath - Path to CHANGELOG.md file
 */
function deleteChangelog(filePath) {
  try {
    fs.unlinkSync(filePath);
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    console.log(`✓ Deleted ${relativePath}`);
  } catch (error) {
    console.error(`✗ Error deleting ${filePath}:`, error.message);
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔄 Resetting project versions and removing changelogs...\n');

  // Reset versions in package.json files
  console.log('📦 Resetting versions in package.json files:');
  const packageJsonFiles = findPackageJsonFiles();
  packageJsonFiles.forEach(resetVersion);

  console.log('\n📝 Deleting CHANGELOG.md files:');
  const changelogFiles = findChangelogFiles();

  if (changelogFiles.length === 0) {
    console.log('⊘ No CHANGELOG.md files found');
  } else {
    changelogFiles.forEach(deleteChangelog);
  }

  console.log('\n✅ Reset complete!');
}

// Run the script
main();
