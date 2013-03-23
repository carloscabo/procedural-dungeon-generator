/*
  ===============================================
  Snt Canvas & Math Helpers
*/

var snt = snt || {};

// Viewport size
snt.ww = document.documentElement.clientWidth;
snt.wh = document.documentElement.clientHeight;

// Read url vars
snt.getUrlVars = function () {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
};


/*
  ===============================================
  Math Helpers
*/

// CANTOR PAIRING
/* Combina 2 números enteros en uno y se puede invertir */
// var newNumber = snt.cantorPair(123,789);
// var originalNumbers = snt.reverseCantorPair(newNumber);
snt.cantorPair = function(x, y) {
  var z = ((x + y) * (x + y + 1)) / 2 + y;
  return z;
};

snt.reverseCantorPair = function(z) {
  var pair = [];
  var t = Math.floor((-1 + Math.sqrt(1 + 8 * z))/2);
  var x = t * (t + 3) / 2 - z;
  var y = z - t * (t + 1) / 2;
  pair[0] = x;
  pair[1] = y;
  return pair;
};

// LERP
/* Calculates a number between two numbers at a specific increment. The amt parameter is the amount to interpolate between the two values where 0.0 equal to the first point, 0.1 is very near the first point, 0.5 is half-way in between, etc. The lerp function is convenient for creating motion along a straight path and for drawing dotted lines. */
snt.lerp = function(value1, value2, amt) {
  return value1 + (value2 - value1) * amt;
};

// ANGLELERP
/* Interpola entre 2 ángulos de 0 a 360, debería devolver el camino más "corto" */
snt.angleLerp = function (ang1, ang2, percent) {
  var ret;
  var diff = Math.abs(ang2 - ang1);
  if (diff > 180) {
    if(ang2 > ang1) {
     ang1 += 360;
   } else {
     ang2 += 360;
   }
 }
    //INTERPOLACION
    ret = (ang1 + ((ang2 - ang1) * percent));
    if (ret < 0 || ret > 360) {
      ret = ret % 360;
    }
    return ret;
  };

// NORM
/* Normalizes a number from another range into a value between 0 and 1. */
snt.norm = function (aNumber, low, high) {
  return (aNumber - low) / (high - low);
};

//NORM 0 - 1
snt.norm01 = snt.norm;

snt.norm10 = function (aNumber, low, high) {
  return Math.abs(((aNumber - low) / (high - low))-1);
};

//NORM 0 - 1 - 0
snt.norm101 = function (aNumber, low, high) {
	return Math.abs(((aNumber - low) / (high - low))-0.5)*2;
};

//NORM 1 - 0 - 1
snt.norm010 = function (aNumber, low, high) {
	return Math.abs((Math.abs(((aNumber - low) / (high - low))-0.5)*2)-1);
};

// MAP
/* Re-maps a number from one range to another. In the example above, the number '25' is converted from a value in the range 0..100 into a value that ranges from the left edge (0) to the right edge (width) of the screen. */
snt.map = function (value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
};

// DIST
/* Calculates the distance between two points. */
/* x1, y1, x2, y2 [,x3, y3 ]*/
snt.dist = function() {
  var dx, dy, dz;
  if (arguments.length === 4) {
    dx = arguments[0] - arguments[2];
    dy = arguments[1] - arguments[3];
    return Math.sqrt(dx * dx + dy * dy);
  }
  if (arguments.length === 6) {
    dx = arguments[0] - arguments[3];
    dy = arguments[1] - arguments[4];
    dz = arguments[2] - arguments[5];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
};

/*
  ===============================================
  Color Management Helpers
*/

snt.rgb = function (col) {
	this[0] = col[0];
	this[1] = col[1];
	this[2] = col[2];

	this.toString = function() {
		return 'rgb(' + this[0] + ',' + this[1] + ',' + this[2] + ')';
	};
};

snt.rgba = function (col) {
	this[0] = col[0];
	this[1] = col[1];
	this[2] = col[2];
	this[3] = col[3];

	this.toString = function() {
		return 'rgba(' + this[0] + ',' + this[1] + ',' + this[2] + ',' + this[3] + ')';
	};
};

snt.hsl = function (col) {
	this[0] = col[0];
	this[1] = col[1];
	this[2] = col[2];

	this.toString = function() {
		return 'hsl(' + this[0] + ',' + this[1] + '%,' + this[2] + '%)';
	};
};

snt.hsla = function (col) {
	this[0] = col[0];
	this[1] = col[1];
	this[2] = col[2];
	this[3] = col[3];

	this.toString = function() {
		return 'hsla(' + this[0] + ',' + this[1] + '%,' + this[2] + '%,' + this[3] + ')';
	};
};

snt.col = function () {
	this.hex;
	this.r;
	this.g;
	this.b;
	this.h;
	this.s;
	this.l;
	this.a;
	this.hsl;
	this.hsla;
	this.rgb;
	this.rgba;
	this.hslString;
	this.hslaString;
	this.rgbString;
	this.rgbaString;

	//ES UN STRINNG -> HEXADECIMAL
	if (typeof arguments[0] == 'string') {
		this.hex = arguments[0];

		this.rgb = new snt.rgb(snt.hexToRgb(this.hex));
		this.r = this.rgb[0];
		this.g = this.rgb[1];
		this.b = this.rgb[2];
		this.a = 1.0;
		this.rgba = new snt.rgba([this.r, this.g, this.b, this.a]);
	}

	//EL PRIMERO ES UN NÚMERO -> RGB[A]
	if (typeof arguments[0] == 'number') {
		this.r = arguments[0];
		this.g = arguments[1];
		this.b = arguments[2];
		if (typeof arguments[3] == 'undefined') {
			this.a = 1.0;
		} else {
			this.a = arguments[3];
		}

		this.rgb    = new snt.rgb([this.r, this.g, this.b]);
		this.rgba   = new snt.rgba([this.r, this.g, this.b, this.a]);

		this.hex = snt.rgbToHex(this.rgb);
	}

	//EL PRIMERO ES UN ARRAY -> RGB[A]
	if (arguments[0] instanceof Array) {
		this.r = arguments[0][0];
		this.g = arguments[0][1];
		this.b = arguments[0][2];
		if (typeof arguments[0][3] == 'undefined') {
			this.a = 1.0;
		} else {
			this.a = arguments[0][3];
		}

		this.rgb    = new snt.rgb([this.r, this.g, this.b]);
		this.rgba   = new snt.rgba([this.r, this.g, this.b, this.a]);

		this.hex = snt.rgbToHex(this.rgb);
	}

	//COMUNES
	this.hsl = new snt.hsl(snt.rgbToHsl(this.rgb));
	this.h = this.hsl[0];
	this.s = this.hsl[1];
	this.l = this.hsl[2];
	this.hsla = new snt.hsla([this.h, this.s, this.l, this.a]);

	this.setHue = function(newhue) {
		this.h = newhue;
		this.hsl[0] = newhue;
		this.hsla[0] = newhue;

		//ACTUALIZA RGB
		this.rgb = null;
		this.rgb = new snt.rgb(snt.hslToRgb(newhue, this.s, this.l));
		this.r = this.rgb[0];
		this.g = this.rgb[1];
		this.b = this.rgb[2];
		this.rgba[0] = this.rgb[0];
		this.rgba[1] = this.rgb[1];
		this.rgba[2] = this.rgb[2];

		//ACTUALIZA HEX
		this.hex = null;
		this.hex = snt.rgbToHex(this.rgb);
	};

	this.setAlpha = function(newalpha) {
		this.a = newalpha;
		this.hsla[3] = newalpha;
		this.rgba[3] = newalpha;
	};

}; //snt.col

snt.hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
  parseInt(result[1], 16),
  parseInt(result[2], 16),
  parseInt(result[3], 16)
  ] : null;
};

function componentToHex (c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

//SE LE PUEDE PASAR rgb o ARRAY
snt.rgbToHex = function () { //r, g, b
	var r, g, b;
	if(arguments.length > 1) {
		r = arguments[0];
		g = arguments[1];
		b = arguments[2];
	} else {
		r = arguments[0][0];
		g = arguments[0][1];
		b = arguments[0][2];
	}
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
 snt.rgbToHsl = function (){
   var r, g, b;

   if (typeof arguments[0] == 'number') {
    r = arguments[0];
    g = arguments[1];
    b = arguments[2];
  } else {
    r = arguments[0][0];
    g = arguments[0][1];
    b = arguments[0][2];
  }

  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
        h = s = 0; // achromatic
      }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;

        //CARLOS
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
      }
      return [h, s, l];
    };

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
 snt.hslToRgb = function (){
  var r, g, b, h, s, l;

  if (typeof arguments[0] == 'number') {
    h = arguments[0] / 360;
    s = arguments[1] / 100;
    l = arguments[2] / 100;
  } else {
    h = arguments[0][0] / 360;
    s = arguments[0][1] / 100;
    l = arguments[0][2] / 100;
  }


  if(s == 0){
        r = g = b = l; // achromatic
      } else {
        function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
 snt.rgbToHsv = function (r, g, b) {
  r = r/255, g = g/255, b = b/255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if(max == min){
        h = 0; // achromatic
      }else{
        switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [h, s, v];
    };

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
 snt.hsvToRgb = function (h, s, v){
  var r, g, b;

    //CARLOS
    h = h / 360;
    s = s / 100;
    v = v / 100;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };
snt.hsbToRgb = snt.hsvToRgb; //ALIAS

//ATAJOS CARLOS
snt.hsvToHsl = function (h, s, v){
	return snt.rgbToHsl(snt.hsvToRgb(h, s, v));
};
snt.hsbToHsl = snt.hsvToHsl;

/*
  ===============================================
  Style Helpers
*/

/* Para usar sin MooTools por ejemplo */
/* setStyle(MI_CANVAS, 'background-color:#242424;'); */

/* setStyle function */
snt.setStyle = function (element, styleText){
  if(element.style.setAttribute)
    element.style.setAttribute("cssText", styleText );
  else
    element.setAttribute("style", styleText );
};

/* getStyle function */
snt.getStyle = function (element){
 var styleText = element.getAttribute('style');
 if(styleText == null)
  return "";
    if (typeof styleText == 'string') // !IE
      return styleText;
    else  // IE
      return styleText.cssText;
  };

/*
  ===============================================
  Object prototypes
*/

