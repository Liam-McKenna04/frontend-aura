// @ts-ignore
import { decode as decodePng } from "https://deno.land/x/pngs/mod.ts";
// @ts-ignore
import { decode as decodeJpeg } from "https://deno.land/x/jpegts/mod.ts";

// Add this enum at the top of the file
export enum NamedColor {
    Black = "black",
    Blue = "blue",
    Brown = "brown",
    Gray = "gray",
    Green = "green",
    Orange = "orange",
    Pink = "pink",
    Purple = "purple",
    Red = "red",
    Teal = "teal",
    White = "white",
    Yellow = "yellow"
}

function colorDistance(color1: number[], color2: number[]): number {
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

function filterSimilarColors(colors: number[][], threshold = 30): number[][] {
    const filteredColors: number[][] = [];
    
    colors.forEach(color => {
        let isSimilar = false;
        
        for (const filteredColor of filteredColors) {
            if (colorDistance(color, filteredColor) < threshold) {
                isSimilar = true;
                break;
            }
        }

        if (!isSimilar) {
            filteredColors.push(color);
        }
    });

    return filteredColors;
}

async function extractColors(imageUrl: string): Promise<number[][]> {
    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        let width: number, height: number, image: Uint8Array;

        // Check the file signature to determine the image format
        if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8) {
            // JPEG signature
            const jpegData = decodeJpeg(uint8Array);
            width = jpegData.width;
            height = jpegData.height;
            image = jpegData.data;
        } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50) {
            // PNG signature
            const pngData = decodePng(uint8Array);
            width = pngData.width;
            height = pngData.height;
            image = pngData.image;
        } else {
            throw new Error("Unsupported image format");
        }

        const pixelArray = createPixelArray(image, width * height, 10);
        const palette = quantize(pixelArray, 10);

        // Get the 5 most different colors
        return palette;
    } catch (error) {
        console.error('Error extracting colors:', error);
        return [];
    }
}

function createPixelArray(pixels: Uint8Array, pixelCount: number, quality: number): number[][] {
    const pixelArray: number[][] = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i += quality) {
        offset = i * 4;
        r = pixels[offset];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];

        // If pixel is mostly opaque and not white
        if ((typeof a === 'undefined' || a >= 125) && !(r > 250 && g > 250 && b > 250)) {
            pixelArray.push([r, g, b]);
        }
    }

    return pixelArray;
}

function quantize(pixels: number[][], colorCount: number): number[][] {
    // Simple implementation of median cut algorithm
    let buckets: number[][][] = [pixels];
    
    while (buckets.length < colorCount) {
        let newBuckets: number[][][] = [];
        for (let bucket of buckets) {
            if (bucket.length > 1) {
                let [bucket1, bucket2] = splitBucket(bucket);
                newBuckets.push(bucket1, bucket2);
            } else {
                newBuckets.push(bucket);
            }
        }
        buckets = newBuckets;
    }

    return buckets.map(averageColor);
}

function splitBucket(bucket: number[][]): [number[][], number[][]] {
    let maxRange = 0;
    let maxComponent = 0;

    for (let i = 0; i < 3; i++) {
        let min = 255, max = 0;
        for (let pixel of bucket) {
            min = Math.min(min, pixel[i]);
            max = Math.max(max, pixel[i]);
        }
        if (max - min > maxRange) {
            maxRange = max - min;
            maxComponent = i;
        }
    }

    bucket.sort((a, b) => a[maxComponent] - b[maxComponent]);
    let mid = Math.floor(bucket.length / 2);
    return [bucket.slice(0, mid), bucket.slice(mid)];
}

function averageColor(bucket: number[][]): number[] {
    let sum = [0, 0, 0];
    for (let pixel of bucket) {
        sum[0] += pixel[0];
        sum[1] += pixel[1];
        sum[2] += pixel[2];
    }
    return sum.map(s => Math.round(s / bucket.length));
}

function calculateScore(value: number, min: number, max: number): number {
    if (value < min) {
        return 5 * (value / min);
    } else if (value > max) {
        return 10 - 5 * ((value - max) / max);
    } else {
        return 5 + 5 * ((value - min) / (max - min));
    }
}

function getHarmonyScore(colors: number[][]): number {
    let totalDistance = 0;
    let comparisons = 0;

    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            totalDistance += colorDistance(colors[i], colors[j]);
            comparisons++;
        }
    }

    const avgDistance = totalDistance / comparisons;
    const idealNumColors = { min: 3, max: 6 };
    const idealAvgDistance = { min: 70, max: 180 };

    let numColorsScore = calculateScore(colors.length, idealNumColors.min, idealNumColors.max);
    let avgDistanceScore = calculateScore(avgDistance, idealAvgDistance.min, idealAvgDistance.max);

    let finalScore = (numColorsScore + avgDistanceScore) / 2;

    return Math.max(1, Math.min(10, Math.round(finalScore * 10) / 10));
}

function getMostDifferentColors(colors: number[][], count: number): number[][] {
    if (colors.length <= count) return colors;

    const result: number[][] = [colors[0]];
    
    while (result.length < count) {
        let maxDistance = -1;
        let maxDistanceColor: number[] | null = null;

        for (const color of colors) {
            if (result.includes(color)) continue;

            let minDistance = Infinity;
            for (const resultColor of result) {
                const distance = colorDistance(color, resultColor);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }

            if (minDistance > maxDistance) {
                maxDistance = minDistance;
                maxDistanceColor = color;
            }
        }

        if (maxDistanceColor) {
            result.push(maxDistanceColor);
        } else {
            break;
        }
    }

    return result;
}

interface UserData {
  name: string;
  screen_name: string;
  description: string;
  profile_image_url_https: string;
  profile_banner_url?: string;
}

interface DescriptorResult {
    colors: string[];
    score: number;
    site_description: string;
    profileColors: string[];
    bannerColors: string[];
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    closestNamedColor: NamedColor; 
}

export async function createDescriptors(userData: UserData): Promise<DescriptorResult> {
    const profileColors = await extractColors(userData.profile_image_url_https);
    const bannerColors = userData.profile_banner_url ? await extractColors(userData.profile_banner_url) : [];

    const allColors = [...profileColors, ...bannerColors];
    const filteredColors = filterSimilarColors(allColors);

    const harmonyScore = getHarmonyScore(filteredColors);

    const fiveDiffColors = getMostDifferentColors(filteredColors, 5);
    const hexColors = fiveDiffColors.map(([r, g, b]) => 
        '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
    );

    // Select primary, secondary, and background colors
    const { primaryColor, secondaryColor, backgroundColor } = selectBestColors(hexColors);
    
    // Add this line to find the closest named color
    const closestNamedColor = findClosestColor(primaryColor);

    return {
        colors: hexColors,
        score: harmonyScore,
        site_description: `A unique site for ${userData.screen_name}`,
        profileColors: profileColors.map(([r, g, b]) => 
            '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
        ), 
        bannerColors: bannerColors.map(([r, g, b]) => 
            '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
        ),
        primaryColor,
        secondaryColor,
        backgroundColor,
        closestNamedColor,
    };
}

function selectBestColors(colors: string[]): { primaryColor: string; secondaryColor: string; backgroundColor: string } {
    // Sort colors by saturation (most saturated first)
    const sortedColors = colors.sort((a, b) => calculateSaturation(b) - calculateSaturation(a));

    // Select primary color (most saturated)
    const primaryColor = sortedColors[0] || '#000000';

    // Find a secondary color that has good contrast with the primary color
    let secondaryColor = sortedColors.find(color => 
        calculateContrast(primaryColor, color) >= 2.5
    ) || '#ffffff';

    // Select background color (least saturated, with good contrast to both primary and secondary)
    let backgroundColor = sortedColors.reverse().find(color => 
        calculateContrast(color, primaryColor) >= 2.5 && 
        calculateContrast(color, secondaryColor) >= 2.5
    );

    // If no suitable background color is found, choose black or white based on contrast
    if (!backgroundColor) {
        backgroundColor = calculateContrast('#ffffff', primaryColor) > calculateContrast('#000000', primaryColor) ? '#ffffff' : '#000000';
    }

    return { primaryColor, secondaryColor, backgroundColor };
}

function calculateSaturation(color: string): number {
    const rgb = hexToRgb(color);
    const max = Math.max(rgb.r, rgb.g, rgb.b) / 255;
    const min = Math.min(rgb.r, rgb.g, rgb.b) / 255;
    return (max - min) / max;
}

function calculateContrast(color1: string, color2: string): number {
    const lum1 = calculateRelativeLuminance(color1);
    const lum2 = calculateRelativeLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function calculateRelativeLuminance(color: string): number {
    const rgb = hexToRgb(color);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function findClosestColor(primaryColor: string): NamedColor {
    const colorList = Object.values(NamedColor);
    
    const primaryRgb = hexToRgb(primaryColor);
    let closestColor = NamedColor.Black;
    let minDistance = Infinity;

    for (const color of colorList) {
        const colorRgb = hexToRgb(getHexForColor(color));
        const distance = colorDistance([primaryRgb.r, primaryRgb.g, primaryRgb.b], [colorRgb.r, colorRgb.g, colorRgb.b]);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    }

    return closestColor;
}

function getHexForColor(color: NamedColor): string {
    const colorMap: { [key in NamedColor]: string } = {
        [NamedColor.Black]: "#000000",
        [NamedColor.Blue]: "#0000FF",
        [NamedColor.Brown]: "#A52A2A",
        [NamedColor.Gray]: "#808080",
        [NamedColor.Green]: "#008000",
        [NamedColor.Orange]: "#FFA500",
        [NamedColor.Pink]: "#FFC0CB",
        [NamedColor.Purple]: "#800080",
        [NamedColor.Red]: "#FF0000",
        [NamedColor.Teal]: "#008080",
        [NamedColor.White]: "#FFFFFF",
        [NamedColor.Yellow]: "#FFFF00"
    };
    return colorMap[color];
}
