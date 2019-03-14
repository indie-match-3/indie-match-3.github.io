// 1 means similar colors
// 0 means any colors

var PatternsList = [
	// C*CC
	{
		pat: [
			[1, 0, 1, 1],
		],
		points: new PointPair(new Point(0, 0), new Point(0, 1)),
	},
	{
		pat: [
			[1, 1, 0, 1],
		],
		points: new PointPair(new Point(0, 3), new Point(0, 2)),
	},
	{
		pat: [
			[1],
			[0],
			[1],
			[1],
		],
		points: new PointPair(new Point(0, 0), new Point(1, 0)),
	},
	{
		pat: [
			[1],
			[1],
			[0],
			[1],
		],
		points: new PointPair(new Point(3, 0), new Point(2, 0)),
	},
	// C**
	// *CC
	{
		pat: [
			[1, 0, 0],
			[0, 1, 1],
		],
		points: new PointPair(new Point(0, 0), new Point(1, 0)),
	},
	{
		pat: [
			[1, 1, 0],
			[0, 0, 1],
		],
		points: new PointPair(new Point(0, 2), new Point(1, 2)),
	},
	{
		pat: [
			[0, 0, 1],
			[1, 1, 0],
		],
		points: new PointPair(new Point(0, 2), new Point(1, 2)),
	},
	{
		pat: [
			[0, 1, 1],
			[1, 0, 0],
		],
		points: new PointPair(new Point(0, 0), new Point(1, 0)),
	},
	{
		pat: [
			[1, 0],
			[0, 1],
			[0, 1],
		],
		points: new PointPair(new Point(0, 0), new Point(0, 1)),
	},
	{
		pat: [
			[1, 0],
			[1, 0],
			[0, 1],
		],
		points: new PointPair(new Point(2, 0), new Point(2, 1)),
	},
	{
		pat: [
			[0, 1],
			[1, 0],
			[1, 0],
		],
		points: new PointPair(new Point(0, 0), new Point(0, 1)),
	},
	{
		pat: [
			[0, 1],
			[0, 1],
			[1, 0],
		],
		points: new PointPair(new Point(2, 0), new Point(2, 1)),
	},
	// C*
	// *C
	// C*
	{
		pat: [
			[1, 0],
			[0, 1],
			[1, 0],
		],
		points: new PointPair(new Point(1, 0), new Point(1, 1)),
	},
	{
		pat: [
			[0, 1],
			[1, 0],
			[0, 1],
		],
		points: new PointPair(new Point(1, 0), new Point(1, 1)),
	},
	{
		pat: [
			[1, 0, 1],
			[0, 1, 0],
		],
		points: new PointPair(new Point(0, 1), new Point(1, 1)),
	},
	{
		pat: [
			[0, 1, 0],
			[1, 0, 1],
		],
		points: new PointPair(new Point(0, 1), new Point(1, 1)),
	},
];