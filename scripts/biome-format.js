#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Read files from stdin (lint-staged passes files as arguments)
const files = process.argv.slice(2).filter(Boolean);

if (files.length === 0) {
  process.exit(0);
}

// Group files by their biome.json location
const filesByConfig = new Map();

for (const file of files) {
  const filePath = path.resolve(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    continue;
  }
  
  const dir = path.dirname(filePath);
  
  // Find the nearest biome.json
  let currentDir = dir;
  let biomeConfigPath = null;
  
  while (currentDir !== path.dirname(currentDir)) {
    const biomeJsonPath = path.join(currentDir, 'biome.json');
    if (fs.existsSync(biomeJsonPath)) {
      biomeConfigPath = currentDir;
      break;
    }
    currentDir = path.dirname(currentDir);
  }
  
  // If no biome.json found, use root
  const workingDir = biomeConfigPath || process.cwd();
  const relativeFile = path.relative(workingDir, filePath);
  
  if (!filesByConfig.has(workingDir)) {
    filesByConfig.set(workingDir, []);
  }
  
  filesByConfig.get(workingDir).push(relativeFile);
}

// Execute biome format for each config location
let hasError = false;

for (const [workingDir, relativeFiles] of filesByConfig.entries()) {
  try {
    const filesArg = relativeFiles.map(f => {
      // Escape spaces and special characters in file paths
      return f.includes(' ') ? `"${f}"` : f;
    }).join(' ');
    
    const result = execSync(`biome format --write ${filesArg}`, {
      cwd: workingDir,
      stdio: 'pipe',
      encoding: 'utf8',
    });
    
    // Log output if there is any
    if (result) {
      process.stdout.write(result);
    }
  } catch (error) {
    const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message || '';
    
    // Ignore "No files were processed" errors - this means files are intentionally excluded
    if (errorOutput.includes('No files were processed') || 
        errorOutput.includes('were provided but ignored')) {
      // This is expected for excluded files, continue
      continue;
    }
    
    // For other errors, log and mark as failed
    if (errorOutput) {
      process.stderr.write(errorOutput);
    }
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

