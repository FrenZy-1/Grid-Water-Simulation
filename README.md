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

		<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
		<script type="module" src="js/app.js"></script>
	</body>
</html>
```

```css
:root[data-theme=light] {
    --bg: #F2EED5;
    --canvas-shape: #1E2F3E;

    --canvas-ripple-100: #890CA6;
    --canvas-ripple-200: #790D92;
    --canvas-ripple-300: #6A0F7F;
    --canvas-ripple-400: #5A106C;
    --canvas-ripple-500: #4B1059;
}

:root[data-theme=dark] {
    --bg: #1E2F3E;
    --canvas-shape: #F2EED5;

    --canvas-ripple-100: #890CA6;
    --canvas-ripple-200: #972CB0;
    --canvas-ripple-300: #A545BA;
    --canvas-ripple-400: #B35CC4;
    --canvas-ripple-500: #C073CE;
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
```
