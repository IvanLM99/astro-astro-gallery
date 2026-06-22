import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/gallery_data.json');
const assetsPath = path.join(__dirname, '../src/assets');

// Read existing data
let galleryData = [];
try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    galleryData = JSON.parse(rawData);
} catch (error) {
    console.error("Could not read gallery_data.json:", error);
    process.exit(1);
}

// Get all existing src paths
const existingPaths = new Set(galleryData.map(item => item.src));

// Function to recursively find images
function getImages(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getImages(filePath));
        } else {
            if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
                results.push(filePath);
            }
        }
    }
    return results;
}

const allImages = getImages(assetsPath);
let newEntriesAdded = false;

allImages.forEach(absolutePath => {
    // Convert absolute path to relative 'assets/...'
    const relativePath = path.relative(path.join(__dirname, '../src'), absolutePath).replace(/\\/g, '/');
    
    if (!existingPaths.has(relativePath)) {
        // Extract info from path
        // e.g. assets/2025/filename.jpeg
        const parts = relativePath.split('/');
        const year = parts.length > 2 ? parts[1] : new Date().getFullYear().toString();
        const filename = path.basename(absolutePath, path.extname(absolutePath));
        
        // Generate a simple ID
        const id = crypto.randomUUID().replace(/-/g, '');
        
        const day = String(new Date().getDate()).padStart(2, '0');
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        
        // Create new entry
        const newEntry = {
            id: id,
            year: year,
            month: month,
            day: day,
            category: "landscape",
            src: relativePath,
            title_en: "Untitled",
            title_es: "Sin título",
            story_en: "",
            story_es: "",
            date: `${day}-${month}-${year}`,
            object_es: "",
            object_en: "",
            exposure: "",
            equipment: ""
        };
        
        // Insert at the beginning so newer images are at the top, or end. JSON gets sorted by date in Gallery.astro anyway.
        galleryData.unshift(newEntry);
        existingPaths.add(relativePath);
        newEntriesAdded = true;
        console.log(`Added new image to JSON: ${relativePath}`);
    }
});

if (newEntriesAdded) {
    fs.writeFileSync(dataPath, JSON.stringify(galleryData, null, 4), 'utf8');
    console.log("gallery_data.json updated successfully.");
} else {
    console.log("No new images found.");
}
