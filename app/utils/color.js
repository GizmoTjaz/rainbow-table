export function formatRGBObject (rgbObject) {
	return `rgb(${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b})`;
}

// https://gist.github.com/mjackson/5311256
export function HSVtoRGB (h, s, v) {

	if (h < 5) {
		return { r: 0, g: 0, b: 0 };
	} else if (h > 355) {
		return { r: 255, g: 255, b: 255 };
	}
  
	const hprime = h / 60;

	const c = v * s;
	const x = c * (1 - Math.abs(hprime % 2 - 1)); 
	const m = v - c;

	let r, g, b;

	if (!hprime) {r = 0; g = 0; b = 0; }
	if (hprime >= 0 && hprime < 1) { r = c; g = x; b = 0}
	if (hprime >= 1 && hprime < 2) { r = x; g = c; b = 0}
	if (hprime >= 2 && hprime < 3) { r = 0; g = c; b = x}
	if (hprime >= 3 && hprime < 4) { r = 0; g = x; b = c}
	if (hprime >= 4 && hprime < 5) { r = x; g = 0; b = c}
	if (hprime >= 5 && hprime < 6) { r = c; g = 0; b = x}
	
	r = Math.round( (r + m)* 255);
	g = Math.round( (g + m)* 255);
	b = Math.round( (b + m)* 255);
  
	return { r, g, b };
}