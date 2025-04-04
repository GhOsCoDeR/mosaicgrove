// Script to convert HTML image designs to actual image files
// Requires: npm install puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Utility function to copy a file
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    console.log(`Copied ${source} to ${destination}`);
    return true;
  } catch (error) {
    console.error(`Error copying ${source}:`, error);
    return false;
  }
}

// Check if we're in a Netlify environment
const isNetlify = process.env.NETLIFY === 'true';

async function convertHtmlToImage() {
  console.log('Starting HTML to image conversion...');
  
  // Create images directory if it doesn't exist
  const outputDir = path.join(__dirname, 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // If on Netlify, try to use static images instead
  if (isNetlify) {
    console.log('Detected Netlify environment, using static images instead');
    
    const staticDir = path.join(__dirname, 'static-images');
    if (fs.existsSync(staticDir)) {
      // Copy static files to images directory
      const files = fs.readdirSync(staticDir);
      files.forEach(file => {
        const destFile = file.endsWith('.html') ? file.replace('.html', '.jpg') : file;
        copyFile(
          path.join(staticDir, file),
          path.join(outputDir, destFile)
        );
      });
      console.log('Static image copying completed!');
      return;
    } else {
      console.warn('Static images directory not found, falling back to browser generation');
    }
  }

  try {
    // Modified launch options for CI environment
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    const htmlFiles = [
      { input: 'images/logo.svg', output: 'logo.svg', type: 'svg' },
      { input: 'images/hero-bg.html', output: 'hero-bg.jpg', width: 1200, height: 600 },
      { input: 'images/products-header.html', output: 'products-header.jpg', width: 1200, height: 300 },
      { input: 'images/contact-header.html', output: 'contact-header.jpg', width: 1200, height: 300 },
      { input: 'images/cashews.html', output: 'cashews.jpg', width: 600, height: 400 },
      { input: 'images/tiger-nuts.html', output: 'tiger-nuts.jpg', width: 600, height: 400 },
      { input: 'images/superfoods.html', output: 'superfoods.jpg', width: 800, height: 500 },
      { input: 'images/gift-sets.html', output: 'gift-sets.jpg', width: 800, height: 500 },
      { input: 'images/founders.html', output: 'founders.jpg', width: 800, height: 500 },
      { input: 'images/community.html', output: 'community.jpg', width: 800, height: 500 },
      { input: 'images/placeholder.html', output: 'placeholder.jpg', width: 1200, height: 800 }
    ];
    
    for (const file of htmlFiles) {
      try {
        if (file.type === 'svg') {
          console.log(`SVG file ${file.input} already exists as vector`);
          continue;
        }
        
        const inputPath = path.join(__dirname, file.input);
        const outputPath = path.join(outputDir, file.output);
        
        // Set viewport size
        await page.setViewport({
          width: file.width || 800,
          height: file.height || 600,
          deviceScaleFactor: 2
        });
        
        // Load the HTML file
        await page.goto(`file://${inputPath}`);
        
        // Wait for any animations or resources to load
        await page.waitForTimeout(500);
        
        // Take screenshot
        await page.screenshot({
          path: outputPath,
          fullPage: false,
          quality: 90
        });
        
        console.log(`Converted ${file.input} to ${file.output}`);
      } catch (error) {
        console.error(`Error processing ${file.input}:`, error);
        
        // Try to use static files as fallback
        const staticFilePath = path.join(__dirname, 'static-images', file.output);
        if (fs.existsSync(staticFilePath)) {
          copyFile(staticFilePath, path.join(outputDir, file.output));
        }
      }
    }
    
    await browser.close();
    console.log('Conversion completed!');
  } catch (error) {
    console.error('Fatal error in image conversion:', error);
    console.log('Attempting to use static images as fallback...');
    
    // Try to copy static files as a last resort
    const staticDir = path.join(__dirname, 'static-images');
    if (fs.existsSync(staticDir)) {
      const files = fs.readdirSync(staticDir);
      files.forEach(file => {
        copyFile(
          path.join(staticDir, file),
          path.join(outputDir, file.replace('.html', '.jpg'))
        );
      });
      console.log('Fallback to static images completed');
    }
  }
}

// Instructions for use:
console.log(`
==========================================
HTML to Image Converter for Mosaic Grove
==========================================

This script converts the HTML design files to actual image files.

To use:
1. Install puppeteer: npm install puppeteer
2. Run this script: node convert-images.js

The script will generate all the images needed for the website.
If you need to customize the image dimensions, edit the width and height
values in the htmlFiles array.

==========================================
`);

// Run the conversion if this file is executed directly
if (require.main === module) {
  convertHtmlToImage().catch(console.error);
} 