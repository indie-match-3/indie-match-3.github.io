var consts = {
	WidthScale: canvas.width / 422,
	HeightScale: canvas.height / 422,

	TileWidth: 40,
	TileHeight: 40,
	WidthBlocks: 10,
	HeightBlocks: 10,
	FieldWidth: this.TileWidth * this.WidthBlocks,
	FieldHeight: this.TileHeight * this.HeightBlocks,
	FallSpeed: 50,
	SwapSpeed: 50,

	colors: [
		"#FF0000", // red
		"#16D100", // green
		"#00A0B0", // blue
		"#EED200", // yellow
		"#C500FF", // purple
		"#0000FF" // orange
	]
}