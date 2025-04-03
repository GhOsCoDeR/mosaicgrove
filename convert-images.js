// Script to convert HTML image designs to actual image files
// Requires: npm install puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function convertHtmlToImage() {
  console.log('Starting HTML to image conversion...');
  
  // Create images directory if it doesn't exist
  const outputDir = path.join(__dirname, 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const browser = await puppeteer.launch();
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
    }
  }
  
  await browser.close();
  console.log('Conversion completed!');
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