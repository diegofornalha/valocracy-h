/* eslint-disable indent */
import axios from 'axios';
import sharp, { OutputInfo, OverlayOptions } from 'sharp';
import { createCanvas } from 'canvas';
import NFTOtherLayerInterface from '@/interfaces/NFTOtherLayerInterface';
import { NFTLayerTypeEnum } from '@/enums/NFTLayerTypeEnum';
import { NFTImageFormatTypeEnum } from '@/enums/NFTImageFormatTypeEnum';

class NFTImageService {
	private async getImageFromUrl(url: string): Promise<OverlayOptions> {
		const response = await axios.get(url, {
			responseType: 'arraybuffer',
		});

		return { input: response.data };
	}

	private async getImage(layer: NFTOtherLayerInterface): Promise<OverlayOptions> {
		switch (layer.image_format) {
			case NFTImageFormatTypeEnum.URL:
				return await this.getImageFromUrl(layer.image);
			case NFTImageFormatTypeEnum.BASE_64:
				return { input: Buffer.from(layer.image, 'base64') };
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async createTextImage(text: string, options: any): Promise<OverlayOptions> {
		// Set up default options and override with any provided options.
		const {
			width = 1300,
			height = 1875,
			fontSize = 31.5,
			font = 'Arial',
			color = '#FFF',
			textAlign = 'center',
			textBaseline = 'middle',
			x = width / 2, // Default x position at the center.
			y = 1369, // Default y position at the middle.
		} = options;

		// Optionally, if you're using custom fonts:
		// registerFont('path/to/font.ttf', { family: 'FontName' });

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');

		// Set text styles.
		ctx.fillStyle = color;
		ctx.font = `${fontSize}px ${font}`;
		ctx.textAlign = textAlign;
		ctx.textBaseline = textBaseline;

		// Optionally, set a background color. Remove or modify as needed.
		// ctx.fillStyle = 'white'; // Or any background color.
		// ctx.fillRect(0, 0, width, height);

		// Draw the text onto the canvas.
		ctx.fillStyle = color; // Set text color again if you set a background color.
		ctx.fillText(text, x, y);

		const buffer = canvas.toBuffer('image/png');
		// Return a PNG buffer.
		return { input: buffer };
	}

	private async createBufferedCompositeLayers(bufferedLayers: OverlayOptions, imageLayer: NFTOtherLayerInterface | null = null) {
		const width: number | null = imageLayer && imageLayer?.layer_options?.width !== undefined ? imageLayer?.layer_options?.width : 1300;
		const height: number | null = imageLayer && imageLayer?.layer_options?.heigth !== undefined ? imageLayer?.layer_options?.heigth : 1875;
		const top: number | undefined = imageLayer && imageLayer?.layer_options?.top || undefined;
		const left: number | undefined = imageLayer && imageLayer?.layer_options?.left || undefined;

		const layer = await sharp(bufferedLayers.input as Buffer)
			.resize(width, height, {
				// Options to ensure the image fits within the dimensions
				// This example ensures the image is resized to fit while maintaining aspect ratio
				fit: sharp.fit.inside,
				// Prevent enlargement if the image is smaller than the target size
				withoutEnlargement: true,
			})
			.toBuffer();

		return { input: layer, top, left };
	}

	async mergeImagesLayers(imageName: string, imageText: string, imagesLayers: Array<NFTOtherLayerInterface>) {
		const otherLayersBuffer: Array<OverlayOptions> = [];

		const imageTextBuffer: OverlayOptions = await this.createTextImage(imageText, {});
		otherLayersBuffer[NFTLayerTypeEnum.TEXT] = await this.createBufferedCompositeLayers(imageTextBuffer);

		for (const imageLayer of imagesLayers.filter(i => i)) {
			const bufferedImage: OverlayOptions = await this.getImage(imageLayer);

			otherLayersBuffer[imageLayer.image_layer] = await this.createBufferedCompositeLayers(bufferedImage, imageLayer);
		}
		const result: OutputInfo = await sharp({
			create: {
				width: 1300,
				height: 1875,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
			},
		})
			.composite(otherLayersBuffer.filter(i => i))
			.toFile(`./tmp/${imageName}.png`);
		console.log(result);
	}
}

export default NFTImageService;
