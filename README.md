# Grid-Water-Simulation

A grid based water surface simulation coded in vanilla js.
Uses double-laplacian dispersion and depth based variable wave speed for more realistic wave fronts.

```html
<!doctype html>
<html lang="en" data-theme="dark">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="style.css" />
		<title>Dynamic Background</title>
	</head>
	<body>
		<canvas id="mainCanvas"></canvas>

		<section id="testSection" style="height: 100vh; background-color: blue">
			<h1 id="testText">Test Section</h1>
		</section>

		<script type="module" src="js/app.js"></script>
	</body>
</html>
```

```css
:root[data-theme="light"] {
	--bg: #f2eed5;
	--text: #1e2f3e;

	--canvas-ripple-100: #890ca6;
	--canvas-ripple-200: #790d92;
	--canvas-ripple-300: #6a0f7f;
	--canvas-ripple-400: #5a106c;
	--canvas-ripple-500: #4b1059;
}

:root[data-theme="dark"] {
	--bg: #1e2f3e;
	--text: #f2eed5;

	--canvas-ripple-100: #890ca6;
	--canvas-ripple-200: #972cb0;
	--canvas-ripple-300: #a545ba;
	--canvas-ripple-400: #b35cc4;
	--canvas-ripple-500: #c073ce;
}

* {
	box-sizing: border-box;
}

html,
body {
	margin: 0;
}

body {
	background-color: var(--bg);
}

#testSection {
	background-color: blue;
	height: 100vh;
}
```
