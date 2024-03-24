module.exports = {
	createCanvas: () => ({
		// Mock the methods of the canvas you use
		getContext: () => ({
			// Mock canvas context methods here
		}),
	}),
	// Add other mocked functions and properties as needed
};
