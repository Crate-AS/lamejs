/*
 *      MP3 window subband -> subband filtering -> mdct routine
 *
 *      Copyright (c) 1999-2000 Takehiro Tominaga
 *
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place - Suite 330,
 * Boston, MA 02111-1307, USA.
 */
/*
 *         Special Thanks to Patrick De Smet for your advices.
 */

/* $Id: NewMDCT.java,v 1.11 2011/05/24 20:48:06 kenchis Exp $ */

//package mp3;

//import java.util.Arrays;
var common = require('./common.js');
var System = common.System;
var VbrMode = common.VbrMode;
var Float = common.Float;
var ShortBlock = common.ShortBlock;
var Util = common.Util;
var Arrays = common.Arrays;
var new_array_n = common.new_array_n;
var new_byte = common.new_byte;
var new_double = common.new_double;
var new_float = common.new_float;
var new_float_n = common.new_float_n;
var new_int = common.new_int;
var new_int_n = common.new_int_n;

var Encoder = require('./Encoder.js');


function NewMDCT() {

	var enwindow = [
			-4.77e-07 * 0.740951125354959 / 2.384e-06,
			1.03951e-04 * 0.740951125354959 / 2.384e-06,
			9.53674e-04 * 0.740951125354959 / 2.384e-06,
			2.841473e-03 * 0.740951125354959 / 2.384e-06,
			3.5758972e-02 * 0.740951125354959 / 2.384e-06,
			3.401756e-03 * 0.740951125354959 / 2.384e-06,
			9.83715e-04 * 0.740951125354959 / 2.384e-06,
			9.9182e-05 * 0.740951125354959 / 2.384e-06, /* 15 */
			1.2398e-05 * 0.740951125354959 / 2.384e-06,
			1.91212e-04 * 0.740951125354959 / 2.384e-06,
			2.283096e-03 * 0.740951125354959 / 2.384e-06,
			1.6994476e-02 * 0.740951125354959 / 2.384e-06,
			-1.8756866e-02 * 0.740951125354959 / 2.384e-06,
			-2.630711e-03 * 0.740951125354959 / 2.384e-06,
			-2.47478e-04 * 0.740951125354959 / 2.384e-06,
			-1.4782e-05 * 0.740951125354959 / 2.384e-06,
			9.063471690191471e-01, 1.960342806591213e-01,

			-4.77e-07 * 0.773010453362737 / 2.384e-06,
			1.05858e-04 * 0.773010453362737 / 2.384e-06,
			9.30786e-04 * 0.773010453362737 / 2.384e-06,
			2.521515e-03 * 0.773010453362737 / 2.384e-06,
			3.5694122e-02 * 0.773010453362737 / 2.384e-06,
			3.643036e-03 * 0.773010453362737 / 2.384e-06,
			9.91821e-04 * 0.773010453362737 / 2.384e-06,
			9.6321e-05 * 0.773010453362737 / 2.384e-06, /* 14 */
			1.1444e-05 * 0.773010453362737 / 2.384e-06,
			1.65462e-04 * 0.773010453362737 / 2.384e-06,
			2.110004e-03 * 0.773010453362737 / 2.384e-06,
			1.6112804e-02 * 0.773010453362737 / 2.384e-06,
			-1.9634247e-02 * 0.773010453362737 / 2.384e-06,
			-2.803326e-03 * 0.773010453362737 / 2.384e-06,
			-2.77042e-04 * 0.773010453362737 / 2.384e-06,
			-1.6689e-05 * 0.773010453362737 / 2.384e-06,
			8.206787908286602e-01, 3.901806440322567e-01,

			-4.77e-07 * 0.803207531480645 / 2.384e-06,
			1.07288e-04 * 0.803207531480645 / 2.384e-06,
			9.02653e-04 * 0.803207531480645 / 2.384e-06,
			2.174854e-03 * 0.803207531480645 / 2.384e-06,
			3.5586357e-02 * 0.803207531480645 / 2.384e-06,
			3.858566e-03 * 0.803207531480645 / 2.384e-06,
			9.95159e-04 * 0.803207531480645 / 2.384e-06,
			9.3460e-05 * 0.803207531480645 / 2.384e-06, /* 13 */
			1.0014e-05 * 0.803207531480645 / 2.384e-06,
			1.40190e-04 * 0.803207531480645 / 2.384e-06,
			1.937389e-03 * 0.803207531480645 / 2.384e-06,
			1.5233517e-02 * 0.803207531480645 / 2.384e-06,
			-2.0506859e-02 * 0.803207531480645 / 2.384e-06,
			-2.974033e-03 * 0.803207531480645 / 2.384e-06,
			-3.07560e-04 * 0.803207531480645 / 2.384e-06,
			-1.8120e-05 * 0.803207531480645 / 2.384e-06,
			7.416505462720353e-01, 5.805693545089249e-01,

			-4.77e-07 * 0.831469612302545 / 2.384e-06,
			1.08242e-04 * 0.831469612302545 / 2.384e-06,
			8.68797e-04 * 0.831469612302545 / 2.384e-06,
			1.800537e-03 * 0.831469612302545 / 2.384e-06,
			3.5435200e-02 * 0.831469612302545 / 2.384e-06,
			4.049301e-03 * 0.831469612302545 / 2.384e-06,
			9.94205e-04 * 0.831469612302545 / 2.384e-06,
			9.0599e-05 * 0.831469612302545 / 2.384e-06, /* 12 */
			9.060e-06 * 0.831469612302545 / 2.384e-06,
			1.16348e-04 * 0.831469612302545 / 2.384e-06,
			1.766682e-03 * 0.831469612302545 / 2.384e-06,
			1.4358521e-02 * 0.831469612302545 / 2.384e-06,
			-2.1372318e-02 * 0.831469612302545 / 2.384e-06,
			-3.14188e-03 * 0.831469612302545 / 2.384e-06,
			-3.39031e-04 * 0.831469612302545 / 2.384e-06,
			-1.9550e-05 * 0.831469612302545 / 2.384e-06,
			6.681786379192989e-01, 7.653668647301797e-01,

			-4.77e-07 * 0.857728610000272 / 2.384e-06,
			1.08719e-04 * 0.857728610000272 / 2.384e-06,
			8.29220e-04 * 0.857728610000272 / 2.384e-06,
			1.399517e-03 * 0.857728610000272 / 2.384e-06,
			3.5242081e-02 * 0.857728610000272 / 2.384e-06,
			4.215240e-03 * 0.857728610000272 / 2.384e-06,
			9.89437e-04 * 0.857728610000272 / 2.384e-06,
			8.7261e-05 * 0.857728610000272 / 2.384e-06, /* 11 */
			8.106e-06 * 0.857728610000272 / 2.384e-06,
			9.3937e-05 * 0.857728610000272 / 2.384e-06,
			1.597881e-03 * 0.857728610000272 / 2.384e-06,
			1.3489246e-02 * 0.857728610000272 / 2.384e-06,
			-2.2228718e-02 * 0.857728610000272 / 2.384e-06,
			-3.306866e-03 * 0.857728610000272 / 2.384e-06,
			-3.71456e-04 * 0.857728610000272 / 2.384e-06,
			-2.1458e-05 * 0.857728610000272 / 2.384e-06,
			5.993769336819237e-01, 9.427934736519954e-01,

			-4.77e-07 * 0.881921264348355 / 2.384e-06,
			1.08719e-04 * 0.881921264348355 / 2.384e-06,
			7.8392e-04 * 0.881921264348355 / 2.384e-06,
			9.71317e-04 * 0.881921264348355 / 2.384e-06,
			3.5007000e-02 * 0.881921264348355 / 2.384e-06,
			4.357815e-03 * 0.881921264348355 / 2.384e-06,
			9.80854e-04 * 0.881921264348355 / 2.384e-06,
			8.3923e-05 * 0.881921264348355 / 2.384e-06, /* 10 */
			7.629e-06 * 0.881921264348355 / 2.384e-06,
			7.2956e-05 * 0.881921264348355 / 2.384e-06,
			1.432419e-03 * 0.881921264348355 / 2.384e-06,
			1.2627602e-02 * 0.881921264348355 / 2.384e-06,
			-2.3074150e-02 * 0.881921264348355 / 2.384e-06,
			-3.467083e-03 * 0.881921264348355 / 2.384e-06,
			-4.04358e-04 * 0.881921264348355 / 2.384e-06,
			-2.3365e-05 * 0.881921264348355 / 2.384e-06,
			5.345111359507916e-01, 1.111140466039205e+00,

			-9.54e-07 * 0.903989293123443 / 2.384e-06,
			1.08242e-04 * 0.903989293123443 / 2.384e-06,
			7.31945e-04 * 0.903989293123443 / 2.384e-06,
			5.15938e-04 * 0.903989293123443 / 2.384e-06,
			3.4730434e-02 * 0.903989293123443 / 2.384e-06,
			4.477024e-03 * 0.903989293123443 / 2.384e-06,
			9.68933e-04 * 0.903989293123443 / 2.384e-06,
			8.0585e-05 * 0.903989293123443 / 2.384e-06, /* 9 */
			6.676e-06 * 0.903989293123443 / 2.384e-06,
			5.2929e-05 * 0.903989293123443 / 2.384e-06,
			1.269817e-03 * 0.903989293123443 / 2.384e-06,
			1.1775017e-02 * 0.903989293123443 / 2.384e-06,
			-2.3907185e-02 * 0.903989293123443 / 2.384e-06,
			-3.622532e-03 * 0.903989293123443 / 2.384e-06,
			-4.38213e-04 * 0.903989293123443 / 2.384e-06,
			-2.5272e-05 * 0.903989293123443 / 2.384e-06,
			4.729647758913199e-01, 1.268786568327291e+00,

			-9.54e-07 * 0.92387953251128675613 / 2.384e-06,
			1.06812e-04 * 0.92387953251128675613 / 2.384e-06,
			6.74248e-04 * 0.92387953251128675613 / 2.384e-06,
			3.3379e-05 * 0.92387953251128675613 / 2.384e-06,
			3.4412861e-02 * 0.92387953251128675613 / 2.384e-06,
			4.573822e-03 * 0.92387953251128675613 / 2.384e-06,
			9.54151e-04 * 0.92387953251128675613 / 2.384e-06,
			7.6771e-05 * 0.92387953251128675613 / 2.384e-06,
			6.199e-06 * 0.92387953251128675613 / 2.384e-06,
			3.4332e-05 * 0.92387953251128675613 / 2.384e-06,
			1.111031e-03 * 0.92387953251128675613 / 2.384e-06,
			1.0933399e-02 * 0.92387953251128675613 / 2.384e-06,
			-2.4725437e-02 * 0.92387953251128675613 / 2.384e-06,
			-3.771782e-03 * 0.92387953251128675613 / 2.384e-06,
			-4.72546e-04 * 0.92387953251128675613 / 2.384e-06,
			-2.7657e-05 * 0.92387953251128675613 / 2.384e-06,
			4.1421356237309504879e-01, /* tan(PI/8) */
			1.414213562373095e+00,

			-9.54e-07 * 0.941544065183021 / 2.384e-06,
			1.05381e-04 * 0.941544065183021 / 2.384e-06,
			6.10352e-04 * 0.941544065183021 / 2.384e-06,
			-4.75883e-04 * 0.941544065183021 / 2.384e-06,
			3.4055710e-02 * 0.941544065183021 / 2.384e-06,
			4.649162e-03 * 0.941544065183021 / 2.384e-06,
			9.35555e-04 * 0.941544065183021 / 2.384e-06,
			7.3433e-05 * 0.941544065183021 / 2.384e-06, /* 7 */
			5.245e-06 * 0.941544065183021 / 2.384e-06,
			1.7166e-05 * 0.941544065183021 / 2.384e-06,
			9.56535e-04 * 0.941544065183021 / 2.384e-06,
			1.0103703e-02 * 0.941544065183021 / 2.384e-06,
			-2.5527000e-02 * 0.941544065183021 / 2.384e-06,
			-3.914356e-03 * 0.941544065183021 / 2.384e-06,
			-5.07355e-04 * 0.941544065183021 / 2.384e-06,
			-3.0041e-05 * 0.941544065183021 / 2.384e-06,
			3.578057213145241e-01, 1.546020906725474e+00,

			-9.54e-07 * 0.956940335732209 / 2.384e-06,
			1.02520e-04 * 0.956940335732209 / 2.384e-06,
			5.39303e-04 * 0.956940335732209 / 2.384e-06,
			-1.011848e-03 * 0.956940335732209 / 2.384e-06,
			3.3659935e-02 * 0.956940335732209 / 2.384e-06,
			4.703045e-03 * 0.956940335732209 / 2.384e-06,
			9.15051e-04 * 0.956940335732209 / 2.384e-06,
			7.0095e-05 * 0.956940335732209 / 2.384e-06, /* 6 */
			4.768e-06 * 0.956940335732209 / 2.384e-06,
			9.54e-07 * 0.956940335732209 / 2.384e-06,
			8.06808e-04 * 0.956940335732209 / 2.384e-06,
			9.287834e-03 * 0.956940335732209 / 2.384e-06,
			-2.6310921e-02 * 0.956940335732209 / 2.384e-06,
			-4.048824e-03 * 0.956940335732209 / 2.384e-06,
			-5.42164e-04 * 0.956940335732209 / 2.384e-06,
			-3.2425e-05 * 0.956940335732209 / 2.384e-06,
			3.033466836073424e-01, 1.662939224605090e+00,

			-1.431e-06 * 0.970031253194544 / 2.384e-06,
			9.9182e-05 * 0.970031253194544 / 2.384e-06,
			4.62532e-04 * 0.970031253194544 / 2.384e-06,
			-1.573563e-03 * 0.970031253194544 / 2.384e-06,
			3.3225536e-02 * 0.970031253194544 / 2.384e-06,
			4.737377e-03 * 0.970031253194544 / 2.384e-06,
			8.91685e-04 * 0.970031253194544 / 2.384e-06,
			6.6280e-05 * 0.970031253194544 / 2.384e-06, /* 5 */
			4.292e-06 * 0.970031253194544 / 2.384e-06,
			-1.3828e-05 * 0.970031253194544 / 2.384e-06,
			6.61850e-04 * 0.970031253194544 / 2.384e-06,
			8.487225e-03 * 0.970031253194544 / 2.384e-06,
			-2.7073860e-02 * 0.970031253194544 / 2.384e-06,
			-4.174709e-03 * 0.970031253194544 / 2.384e-06,
			-5.76973e-04 * 0.970031253194544 / 2.384e-06,
			-3.4809e-05 * 0.970031253194544 / 2.384e-06,
			2.504869601913055e-01, 1.763842528696710e+00,

			-1.431e-06 * 0.98078528040323 / 2.384e-06,
			9.5367e-05 * 0.98078528040323 / 2.384e-06,
			3.78609e-04 * 0.98078528040323 / 2.384e-06,
			-2.161503e-03 * 0.98078528040323 / 2.384e-06,
			3.2754898e-02 * 0.98078528040323 / 2.384e-06,
			4.752159e-03 * 0.98078528040323 / 2.384e-06,
			8.66413e-04 * 0.98078528040323 / 2.384e-06,
			6.2943e-05 * 0.98078528040323 / 2.384e-06, /* 4 */
			3.815e-06 * 0.98078528040323 / 2.384e-06,
			-2.718e-05 * 0.98078528040323 / 2.384e-06,
			5.22137e-04 * 0.98078528040323 / 2.384e-06,
			7.703304e-03 * 0.98078528040323 / 2.384e-06,
			-2.7815342e-02 * 0.98078528040323 / 2.384e-06,
			-4.290581e-03 * 0.98078528040323 / 2.384e-06,
			-6.11782e-04 * 0.98078528040323 / 2.384e-06,
			-3.7670e-05 * 0.98078528040323 / 2.384e-06,
			1.989123673796580e-01, 1.847759065022573e+00,

			-1.907e-06 * 0.989176509964781 / 2.384e-06,
			9.0122e-05 * 0.989176509964781 / 2.384e-06,
			2.88486e-04 * 0.989176509964781 / 2.384e-06,
			-2.774239e-03 * 0.989176509964781 / 2.384e-06,
			3.2248020e-02 * 0.989176509964781 / 2.384e-06,
			4.748821e-03 * 0.989176509964781 / 2.384e-06,
			8.38757e-04 * 0.989176509964781 / 2.384e-06,
			5.9605e-05 * 0.989176509964781 / 2.384e-06, /* 3 */
			3.338e-06 * 0.989176509964781 / 2.384e-06,
			-3.9577e-05 * 0.989176509964781 / 2.384e-06,
			3.88145e-04 * 0.989176509964781 / 2.384e-06,
			6.937027e-03 * 0.989176509964781 / 2.384e-06,
			-2.8532982e-02 * 0.989176509964781 / 2.384e-06,
			-4.395962e-03 * 0.989176509964781 / 2.384e-06,
			-6.46591e-04 * 0.989176509964781 / 2.384e-06,
			-4.0531e-05 * 0.989176509964781 / 2.384e-06,
			1.483359875383474e-01, 1.913880671464418e+00,

			-1.907e-06 * 0.995184726672197 / 2.384e-06,
			8.4400e-05 * 0.995184726672197 / 2.384e-06,
			1.91689e-04 * 0.995184726672197 / 2.384e-06,
			-3.411293e-03 * 0.995184726672197 / 2.384e-06,
			3.1706810e-02 * 0.995184726672197 / 2.384e-06,
			4.728317e-03 * 0.995184726672197 / 2.384e-06,
			8.09669e-04 * 0.995184726672197 / 2.384e-06,
			5.579e-05 * 0.995184726672197 / 2.384e-06,
			3.338e-06 * 0.995184726672197 / 2.384e-06,
			-5.0545e-05 * 0.995184726672197 / 2.384e-06,
			2.59876e-04 * 0.995184726672197 / 2.384e-06,
			6.189346e-03 * 0.995184726672197 / 2.384e-06,
			-2.9224873e-02 * 0.995184726672197 / 2.384e-06,
			-4.489899e-03 * 0.995184726672197 / 2.384e-06,
			-6.80923e-04 * 0.995184726672197 / 2.384e-06,
			-4.3392e-05 * 0.995184726672197 / 2.384e-06,
			9.849140335716425e-02, 1.961570560806461e+00,

			-2.384e-06 * 0.998795456205172 / 2.384e-06,
			7.7724e-05 * 0.998795456205172 / 2.384e-06,
			8.8215e-05 * 0.998795456205172 / 2.384e-06,
			-4.072189e-03 * 0.998795456205172 / 2.384e-06,
			3.1132698e-02 * 0.998795456205172 / 2.384e-06,
			4.691124e-03 * 0.998795456205172 / 2.384e-06,
			7.79152e-04 * 0.998795456205172 / 2.384e-06,
			5.2929e-05 * 0.998795456205172 / 2.384e-06,
			2.861e-06 * 0.998795456205172 / 2.384e-06,
			-6.0558e-05 * 0.998795456205172 / 2.384e-06,
			1.37329e-04 * 0.998795456205172 / 2.384e-06,
			5.462170e-03 * 0.998795456205172 / 2.384e-06,
			-2.9890060e-02 * 0.998795456205172 / 2.384e-06,
			-4.570484e-03 * 0.998795456205172 / 2.384e-06,
			-7.14302e-04 * 0.998795456205172 / 2.384e-06,
			-4.6253e-05 * 0.998795456205172 / 2.384e-06,
			4.912684976946725e-02, 1.990369453344394e+00,

			3.5780907e-02 * Util.SQRT2 * 0.5 / 2.384e-06,
			1.7876148e-02 * Util.SQRT2 * 0.5 / 2.384e-06,
			3.134727e-03 * Util.SQRT2 * 0.5 / 2.384e-06,
			2.457142e-03 * Util.SQRT2 * 0.5 / 2.384e-06,
			9.71317e-04 * Util.SQRT2 * 0.5 / 2.384e-06,
			2.18868e-04 * Util.SQRT2 * 0.5 / 2.384e-06,
			1.01566e-04 * Util.SQRT2 * 0.5 / 2.384e-06,
			1.3828e-05 * Util.SQRT2 * 0.5 / 2.384e-06,

			3.0526638e-02 / 2.384e-06, 4.638195e-03 / 2.384e-06,
			7.47204e-04 / 2.384e-06, 4.9591e-05 / 2.384e-06,
			4.756451e-03 / 2.384e-06, 2.1458e-05 / 2.384e-06,
			-6.9618e-05 / 2.384e-06, /* 2.384e-06/2.384e-06 */
	];

	var NS = 12;
	var NL = 36;

	var win = [
	    [
	     2.382191739347913e-13,
	     6.423305872147834e-13,
	     9.400849094049688e-13,
	     1.122435026096556e-12,
	     1.183840321267481e-12,
	     1.122435026096556e-12,
	     9.400849094049690e-13,
	     6.423305872147839e-13,
	     2.382191739347918e-13,

	     5.456116108943412e-12,
	     4.878985199565852e-12,
	     4.240448995017367e-12,
	     3.559909094758252e-12,
	     2.858043359288075e-12,
	     2.156177623817898e-12,
	     1.475637723558783e-12,
	     8.371015190102974e-13,
	     2.599706096327376e-13,

	     -5.456116108943412e-12,
	     -4.878985199565852e-12,
	     -4.240448995017367e-12,
	     -3.559909094758252e-12,
	     -2.858043359288076e-12,
	     -2.156177623817898e-12,
	     -1.475637723558783e-12,
	     -8.371015190102975e-13,
	     -2.599706096327376e-13,

	     -2.382191739347923e-13,
	     -6.423305872147843e-13,
	     -9.400849094049696e-13,
	     -1.122435026096556e-12,
	     -1.183840321267481e-12,
	     -1.122435026096556e-12,
	     -9.400849094049694e-13,
	     -6.423305872147840e-13,
	     -2.382191739347918e-13,
	     ],
	    [
	     2.382191739347913e-13,
	     6.423305872147834e-13,
	     9.400849094049688e-13,
	     1.122435026096556e-12,
	     1.183840321267481e-12,
	     1.122435026096556e-12,
	     9.400849094049688e-13,
	     6.423305872147841e-13,
	     2.382191739347918e-13,

	     5.456116108943413e-12,
	     4.878985199565852e-12,
	     4.240448995017367e-12,
	     3.559909094758253e-12,
	     2.858043359288075e-12,
	     2.156177623817898e-12,
	     1.475637723558782e-12,
	     8.371015190102975e-13,
	     2.599706096327376e-13,

	     -5.461314069809755e-12,
	     -4.921085770524055e-12,
	     -4.343405037091838e-12,
	     -3.732668368707687e-12,
	     -3.093523840190885e-12,
	     -2.430835727329465e-12,
	     -1.734679010007751e-12,
	     -9.748253656609281e-13,
	     -2.797435120168326e-13,

	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     -2.283748241799531e-13,
	     -4.037858874020686e-13,
	     -2.146547464825323e-13,
	     ],
	    [
	     1.316524975873958e-01, /* win[SHORT_TYPE] */
	     4.142135623730950e-01,
	     7.673269879789602e-01,

	     1.091308501069271e+00, /* tantab_l */
	     1.303225372841206e+00,
	     1.569685577117490e+00,
	     1.920982126971166e+00,
	     2.414213562373094e+00,
	     3.171594802363212e+00,
	     4.510708503662055e+00,
	     7.595754112725146e+00,
	     2.290376554843115e+01,

	     0.98480775301220802032, /* cx */
	     0.64278760968653936292,
	     0.34202014332566882393,
	     0.93969262078590842791,
	     -0.17364817766693030343,
	     -0.76604444311897790243,
	     0.86602540378443870761,
	     0.500000000000000e+00,

	     -5.144957554275265e-01, /* ca */
	     -4.717319685649723e-01,
	     -3.133774542039019e-01,
	     -1.819131996109812e-01,
	     -9.457419252642064e-02,
	     -4.096558288530405e-02,
	     -1.419856857247115e-02,
	     -3.699974673760037e-03,

	     8.574929257125442e-01, /* cs */
	     8.817419973177052e-01,
	     9.496286491027329e-01,
	     9.833145924917901e-01,
	     9.955178160675857e-01,
	     9.991605581781475e-01,
	     9.998991952444470e-01,
	     9.999931550702802e-01,
	     ],
	    [
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     0.000000000000000e+00,
	     2.283748241799531e-13,
	     4.037858874020686e-13,
	     2.146547464825323e-13,

	     5.461314069809755e-12,
	     4.921085770524055e-12,
	     4.343405037091838e-12,
	     3.732668368707687e-12,
	     3.093523840190885e-12,
	     2.430835727329466e-12,
	     1.734679010007751e-12,
	     9.748253656609281e-13,
	     2.797435120168326e-13,

	     -5.456116108943413e-12,
	     -4.878985199565852e-12,
	     -4.240448995017367e-12,
	     -3.559909094758253e-12,
	     -2.858043359288075e-12,
	     -2.156177623817898e-12,
	     -1.475637723558782e-12,
	     -8.371015190102975e-13,
	     -2.599706096327376e-13,

	     -2.382191739347913e-13,
	     -6.423305872147834e-13,
	     -9.400849094049688e-13,
	     -1.122435026096556e-12,
	     -1.183840321267481e-12,
	     -1.122435026096556e-12,
	     -9.400849094049688e-13,
	     -6.423305872147841e-13,
	     -2.382191739347918e-13,
	     ]
	];

	var tantab_l = win[Encoder.SHORT_TYPE];
	var cx = win[Encoder.SHORT_TYPE];
	var ca = win[Encoder.SHORT_TYPE];
	var cs = win[Encoder.SHORT_TYPE];

	/**
	 * new IDCT routine written by Takehiro TOMINAGA
	 * 
	 * PURPOSE: Overlapping window on PCM samples<BR>
	 * 
	 * SEMANTICS:<BR>
	 * 32 16-bit pcm samples are scaled to fractional 2's complement and
	 * concatenated to the end of the window buffer #x#. The updated window
	 * buffer #x# is then windowed by the analysis window #c# to produce the
	 * windowed sample #z#
	 */
	var order = [
	    0, 1, 16, 17, 8, 9, 24, 25, 4, 5, 20, 21, 12, 13, 28, 29,
	    2, 3, 18, 19, 10, 11, 26, 27, 6, 7, 22, 23, 14, 15, 30, 31
	];

	/**
	 * returns sum_j=0^31 a[j]*cos(PI*j*(k+1/2)/32), 0<=k<32
	 */
	function window_subband(x1, x1Pos, a) {
		var wp = 10;

		var x2 = x1Pos + 238 - 14 - 286;

		for (var i = -15; i < 0; i++) {
			var w, s, t;

			w = enwindow[wp + -10];
			s = x1[x2 + -224] * w;
			t = x1[x1Pos + 224] * w;
			w = enwindow[wp + -9];
			s += x1[x2 + -160] * w;
			t += x1[x1Pos + 160] * w;
			w = enwindow[wp + -8];
			s += x1[x2 + -96] * w;
			t += x1[x1Pos + 96] * w;
			w = enwindow[wp + -7];
			s += x1[x2 + -32] * w;
			t += x1[x1Pos + 32] * w;
			w = enwindow[wp + -6];
			s += x1[x2 + 32] * w;
			t += x1[x1Pos + -32] * w;
			w = enwindow[wp + -5];
			s += x1[x2 + 96] * w;
			t += x1[x1Pos + -96] * w;
			w = enwindow[wp + -4];
			s += x1[x2 + 160] * w;
			t += x1[x1Pos + -160] * w;
			w = enwindow[wp + -3];
			s += x1[x2 + 224] * w;
			t += x1[x1Pos + -224] * w;

			w = enwindow[wp + -2];
			s += x1[x1Pos + -256] * w;
			t -= x1[x2 + 256] * w;
			w = enwindow[wp + -1];
			s += x1[x1Pos + -192] * w;
			t -= x1[x2 + 192] * w;
			w = enwindow[wp + 0];
			s += x1[x1Pos + -128] * w;
			t -= x1[x2 + 128] * w;
			w = enwindow[wp + 1];
			s += x1[x1Pos + -64] * w;
			t -= x1[x2 + 64] * w;
			w = enwindow[wp + 2];
			s += x1[x1Pos + 0] * w;
			t -= x1[x2 + 0] * w;
			w = enwindow[wp + 3];
			s += x1[x1Pos + 64] * w;
			t -= x1[x2 + -64] * w;
			w = enwindow[wp + 4];
			s += x1[x1Pos + 128] * w;
			t -= x1[x2 + -128] * w;
			w = enwindow[wp + 5];
			s += x1[x1Pos + 192] * w;
			t -= x1[x2 + -192] * w;

			/*
			 * this multiplyer could be removed, but it needs more 256 FLOAT
			 * data. thinking about the data cache performance, I think we
			 * should not use such a huge table. tt 2000/Oct/25
			 */
			s *= enwindow[wp + 6];
			w = t - s;
			a[30 + i * 2] = t + s;
			a[31 + i * 2] = enwindow[wp + 7] * w;
			wp += 18;
			x1Pos--;
			x2++;
		}
		{
			var s, t, u, v;
			t = x1[x1Pos + -16] * enwindow[wp + -10];
			s = x1[x1Pos + -32] * enwindow[wp + -2];
			t += (x1[x1Pos + -48] - x1[x1Pos + 16]) * enwindow[wp + -9];
			s += x1[x1Pos + -96] * enwindow[wp + -1];
			t += (x1[x1Pos + -80] + x1[x1Pos + 48]) * enwindow[wp + -8];
			s += x1[x1Pos + -160] * enwindow[wp + 0];
			t += (x1[x1Pos + -112] - x1[x1Pos + 80]) * enwindow[wp + -7];
			s += x1[x1Pos + -224] * enwindow[wp + 1];
			t += (x1[x1Pos + -144] + x1[x1Pos + 112]) * enwindow[wp + -6];
			s -= x1[x1Pos + 32] * enwindow[wp + 2];
			t += (x1[x1Pos + -176] - x1[x1Pos + 144]) * enwindow[wp + -5];
			s -= x1[x1Pos + 96] * enwindow[wp + 3];
			t += (x1[x1Pos + -208] + x1[x1Pos + 176]) * enwindow[wp + -4];
			s -= x1[x1Pos + 160] * enwindow[wp + 4];
			t += (x1[x1Pos + -240] - x1[x1Pos + 208]) * enwindow[wp + -3];
			s -= x1[x1Pos + 224];

			u = s - t;
			v = s + t;

			t = a[14];
			s = a[15] - t;

			a[31] = v + t; /* A0 */
			a[30] = u + s; /* A1 */
			a[15] = u - s; /* A2 */
			a[14] = v - t; /* A3 */
		}
		{
			var xr;
			xr = a[28] - a[0];
			a[0] += a[28];
			a[28] = xr * enwindow[wp + -2 * 18 + 7];
			xr = a[29] - a[1];
			a[1] += a[29];
			a[29] = xr * enwindow[wp + -2 * 18 + 7];

			xr = a[26] - a[2];
			a[2] += a[26];
			a[26] = xr * enwindow[wp + -4 * 18 + 7];
			xr = a[27] - a[3];
			a[3] += a[27];
			a[27] = xr * enwindow[wp + -4 * 18 + 7];

			xr = a[24] - a[4];
			a[4] += a[24];
			a[24] = xr * enwindow[wp + -6 * 18 + 7];
			xr = a[25] - a[5];
			a[5] += a[25];
			a[25] = xr * enwindow[wp + -6 * 18 + 7];

			xr = a[22] - a[6];
			a[6] += a[22];
			a[22] = xr * Util.SQRT2;
			xr = a[23] - a[7];
			a[7] += a[23];
			a[23] = xr * Util.SQRT2 - a[7];
			a[7] -= a[6];
			a[22] -= a[7];
			a[23] -= a[22];

			xr = a[6];
			a[6] = a[31] - xr;
			a[31] = a[31] + xr;
			xr = a[7];
			a[7] = a[30] - xr;
			a[30] = a[30] + xr;
			xr = a[22];
			a[22] = a[15] - xr;
			a[15] = a[15] + xr;
			xr = a[23];
			a[23] = a[14] - xr;
			a[14] = a[14] + xr;

			xr = a[20] - a[8];
			a[8] += a[20];
			a[20] = xr * enwindow[wp + -10 * 18 + 7];
			xr = a[21] - a[9];
			a[9] += a[21];
			a[21] = xr * enwindow[wp + -10 * 18 + 7];

			xr = a[18] - a[10];
			a[10] += a[18];
			a[18] = xr * enwindow[wp + -12 * 18 + 7];
			xr = a[19] - a[11];
			a[11] += a[19];
			a[19] = xr * enwindow[wp + -12 * 18 + 7];

			xr = a[16] - a[12];
			a[12] += a[16];
			a[16] = xr * enwindow[wp + -14 * 18 + 7];
			xr = a[17] - a[13];
			a[13] += a[17];
			a[17] = xr * enwindow[wp + -14 * 18 + 7];

			xr = -a[20] + a[24];
			a[20] += a[24];
			a[24] = xr * enwindow[wp + -12 * 18 + 7];
			xr = -a[21] + a[25];
			a[21] += a[25];
			a[25] = xr * enwindow[wp + -12 * 18 + 7];

			xr = a[4] - a[8];
			a[4] += a[8];
			a[8] = xr * enwindow[wp + -12 * 18 + 7];
			xr = a[5] - a[9];
			a[5] += a[9];
			a[9] = xr * enwindow[wp + -12 * 18 + 7];

			xr = a[0] - a[12];
			a[0] += a[12];
			a[12] = xr * enwindow[wp + -4 * 18 + 7];
			xr = a[1] - a[13];
			a[1] += a[13];
			a[13] = xr * enwindow[wp + -4 * 18 + 7];
			xr = a[16] - a[28];
			a[16] += a[28];
			a[28] = xr * enwindow[wp + -4 * 18 + 7];
			xr = -a[17] + a[29];
			a[17] += a[29];
			a[29] = xr * enwindow[wp + -4 * 18 + 7];

			xr = Util.SQRT2 * (a[2] - a[10]);
			a[2] += a[10];
			a[10] = xr;
			xr = Util.SQRT2 * (a[3] - a[11]);
			a[3] += a[11];
			a[11] = xr;
			xr = Util.SQRT2 * (-a[18] + a[26]);
			a[18] += a[26];
			a[26] = xr - a[18];
			xr = Util.SQRT2 * (-a[19] + a[27]);
			a[19] += a[27];
			a[27] = xr - a[19];

			xr = a[2];
			a[19] -= a[3];
			a[3] -= xr;
			a[2] = a[31] - xr;
			a[31] += xr;
			xr = a[3];
			a[11] -= a[19];
			a[18] -= xr;
			a[3] = a[30] - xr;
			a[30] += xr;
			xr = a[18];
			a[27] -= a[11];
			a[19] -= xr;
			a[18] = a[15] - xr;
			a[15] += xr;

			xr = a[19];
			a[10] -= xr;
			a[19] = a[14] - xr;
			a[14] += xr;
			xr = a[10];
			a[11] -= xr;
			a[10] = a[23] - xr;
			a[23] += xr;
			xr = a[11];
			a[26] -= xr;
			a[11] = a[22] - xr;
			a[22] += xr;
			xr = a[26];
			a[27] -= xr;
			a[26] = a[7] - xr;
			a[7] += xr;

			xr = a[27];
			a[27] = a[6] - xr;
			a[6] += xr;

			xr = Util.SQRT2 * (a[0] - a[4]);
			a[0] += a[4];
			a[4] = xr;
			xr = Util.SQRT2 * (a[1] - a[5]);
			a[1] += a[5];
			a[5] = xr;
			xr = Util.SQRT2 * (a[16] - a[20]);
			a[16] += a[20];
			a[20] = xr;
			xr = Util.SQRT2 * (a[17] - a[21]);
			a[17] += a[21];
			a[21] = xr;

			xr = -Util.SQRT2 * (a[8] - a[12]);
			a[8] += a[12];
			a[12] = xr - a[8];
			xr = -Util.SQRT2 * (a[9] - a[13]);
			a[9] += a[13];
			a[13] = xr - a[9];
			xr = -Util.SQRT2 * (a[25] - a[29]);
			a[25] += a[29];
			a[29] = xr - a[25];
			xr = -Util.SQRT2 * (a[24] + a[28]);
			a[24] -= a[28];
			a[28] = xr - a[24];

			xr = a[24] - a[16];
			a[24] = xr;
			xr = a[20] - xr;
			a[20] = xr;
			xr = a[28] - xr;
			a[28] = xr;

			xr = a[25] - a[17];
			a[25] = xr;
			xr = a[21] - xr;
			a[21] = xr;
			xr = a[29] - xr;
			a[29] = xr;

			xr = a[17] - a[1];
			a[17] = xr;
			xr = a[9] - xr;
			a[9] = xr;
			xr = a[25] - xr;
			a[25] = xr;
			xr = a[5] - xr;
			a[5] = xr;
			xr = a[21] - xr;
			a[21] = xr;
			xr = a[13] - xr;
			a[13] = xr;
			xr = a[29] - xr;
			a[29] = xr;

			xr = a[1] - a[0];
			a[1] = xr;
			xr = a[16] - xr;
			a[16] = xr;
			xr = a[17] - xr;
			a[17] = xr;
			xr = a[8] - xr;
			a[8] = xr;
			xr = a[9] - xr;
			a[9] = xr;
			xr = a[24] - xr;
			a[24] = xr;
			xr = a[25] - xr;
			a[25] = xr;
			xr = a[4] - xr;
			a[4] = xr;
			xr = a[5] - xr;
			a[5] = xr;
			xr = a[20] - xr;
			a[20] = xr;
			xr = a[21] - xr;
			a[21] = xr;
			xr = a[12] - xr;
			a[12] = xr;
			xr = a[13] - xr;
			a[13] = xr;
			xr = a[28] - xr;
			a[28] = xr;
			xr = a[29] - xr;
			a[29] = xr;

			xr = a[0];
			a[0] += a[31];
			a[31] -= xr;
			xr = a[1];
			a[1] += a[30];
			a[30] -= xr;
			xr = a[16];
			a[16] += a[15];
			a[15] -= xr;
			xr = a[17];
			a[17] += a[14];
			a[14] -= xr;
			xr = a[8];
			a[8] += a[23];
			a[23] -= xr;
			xr = a[9];
			a[9] += a[22];
			a[22] -= xr;
			xr = a[24];
			a[24] += a[7];
			a[7] -= xr;
			xr = a[25];
			a[25] += a[6];
			a[6] -= xr;
			xr = a[4];
			a[4] += a[27];
			a[27] -= xr;
			xr = a[5];
			a[5] += a[26];
			a[26] -= xr;
			xr = a[20];
			a[20] += a[11];
			a[11] -= xr;
			xr = a[21];
			a[21] += a[10];
			a[10] -= xr;
			xr = a[12];
			a[12] += a[19];
			a[19] -= xr;
			xr = a[13];
			a[13] += a[18];
			a[18] -= xr;
			xr = a[28];
			a[28] += a[3];
			a[3] -= xr;
			xr = a[29];
			a[29] += a[2];
			a[2] -= xr;
		}
	}

	/**
	 * Function: Calculation of the MDCT In the case of long blocks (type 0,1,3)
	 * there are 36 coefficents in the time domain and 18 in the frequency
	 * domain.<BR>
	 * In the case of short blocks (type 2) there are 3 transformations with
	 * short length. This leads to 12 coefficents in the time and 6 in the
	 * frequency domain. In this case the results are stored side by side in the
	 * vector out[].
	 * 
	 * New layer3
	 */
	function mdct_short(inout, inoutPos) {
		for (var l = 0; l < 3; l++) {
			var tc0, tc1, tc2, ts0, ts1, ts2;

			ts0 = inout[inoutPos + 2 * 3] * win[Encoder.SHORT_TYPE][0]
					- inout[inoutPos + 5 * 3];
			tc0 = inout[inoutPos + 0 * 3] * win[Encoder.SHORT_TYPE][2]
					- inout[inoutPos + 3 * 3];
			tc1 = ts0 + tc0;
			tc2 = ts0 - tc0;

			ts0 = inout[inoutPos + 5 * 3] * win[Encoder.SHORT_TYPE][0]
					+ inout[inoutPos + 2 * 3];
			tc0 = inout[inoutPos + 3 * 3] * win[Encoder.SHORT_TYPE][2]
					+ inout[inoutPos + 0 * 3];
			ts1 = ts0 + tc0;
			ts2 = -ts0 + tc0;

			tc0 = (inout[inoutPos + 1 * 3] * win[Encoder.SHORT_TYPE][1] - inout[inoutPos + 4 * 3]) * 2.069978111953089e-11;
			/*
			 * tritab_s [ 1 ]
			 */
			ts0 = (inout[inoutPos + 4 * 3] * win[Encoder.SHORT_TYPE][1] + inout[inoutPos + 1 * 3]) * 2.069978111953089e-11;
			/*
			 * tritab_s [ 1 ]
			 */
			inout[inoutPos + 3 * 0] = tc1 * 1.907525191737280e-11 + tc0;
			/*
			 * tritab_s[ 2 ]
			 */
			inout[inoutPos + 3 * 5] = -ts1 * 1.907525191737280e-11 + ts0;
			/*
			 * tritab_s[0 ]
			 */
			tc2 = tc2 * 0.86602540378443870761 * 1.907525191737281e-11;
			/*
			 * tritab_s[ 2]
			 */
			ts1 = ts1 * 0.5 * 1.907525191737281e-11 + ts0;
			inout[inoutPos + 3 * 1] = tc2 - ts1;
			inout[inoutPos + 3 * 2] = tc2 + ts1;

			tc1 = tc1 * 0.5 * 1.907525191737281e-11 - tc0;
			ts2 = ts2 * 0.86602540378443870761 * 1.907525191737281e-11;
			/*
			 * tritab_s[ 0]
			 */
			inout[inoutPos + 3 * 3] = tc1 + ts2;
			inout[inoutPos + 3 * 4] = tc1 - ts2;

			inoutPos++;
		}
	}

	function mdct_long(out, outPos, _in) {
		var ct, st;
		{
			var tc1, tc2, tc3, tc4, ts5, ts6, ts7, ts8;
			/* 1,2, 5,6, 9,10, 13,14, 17 */
			tc1 = _in[17] - _in[9];
			tc3 = _in[15] - _in[11];
			tc4 = _in[14] - _in[12];
			ts5 = _in[0] + _in[8];
			ts6 = _in[1] + _in[7];
			ts7 = _in[2] + _in[6];
			ts8 = _in[3] + _in[5];

			out[outPos + 17] = (ts5 + ts7 - ts8) - (ts6 - _in[4]);
			st = (ts5 + ts7 - ts8) * cx[12 + 7] + (ts6 - _in[4]);
			ct = (tc1 - tc3 - tc4) * cx[12 + 6];
			out[outPos + 5] = ct + st;
			out[outPos + 6] = ct - st;

			tc2 = (_in[16] - _in[10]) * cx[12 + 6];
			ts6 = ts6 * cx[12 + 7] + _in[4];
			ct = tc1 * cx[12 + 0] + tc2 + tc3 * cx[12 + 1] + tc4 * cx[12 + 2];
			st = -ts5 * cx[12 + 4] + ts6 - ts7 * cx[12 + 5] + ts8 * cx[12 + 3];
			out[outPos + 1] = ct + st;
			out[outPos + 2] = ct - st;

			ct = tc1 * cx[12 + 1] - tc2 - tc3 * cx[12 + 2] + tc4 * cx[12 + 0];
			st = -ts5 * cx[12 + 5] + ts6 - ts7 * cx[12 + 3] + ts8 * cx[12 + 4];
			out[outPos + 9] = ct + st;
			out[outPos + 10] = ct - st;

			ct = tc1 * cx[12 + 2] - tc2 + tc3 * cx[12 + 0] - tc4 * cx[12 + 1];
			st = ts5 * cx[12 + 3] - ts6 + ts7 * cx[12 + 4] - ts8 * cx[12 + 5];
			out[outPos + 13] = ct + st;
			out[outPos + 14] = ct - st;
		}
		{
			var ts1, ts2, ts3, ts4, tc5, tc6, tc7, tc8;

			ts1 = _in[8] - _in[0];
			ts3 = _in[6] - _in[2];
			ts4 = _in[5] - _in[3];
			tc5 = _in[17] + _in[9];
			tc6 = _in[16] + _in[10];
			tc7 = _in[15] + _in[11];
			tc8 = _in[14] + _in[12];

			out[outPos + 0] = (tc5 + tc7 + tc8) + (tc6 + _in[13]);
			ct = (tc5 + tc7 + tc8) * cx[12 + 7] - (tc6 + _in[13]);
			st = (ts1 - ts3 + ts4) * cx[12 + 6];
			out[outPos + 11] = ct + st;
			out[outPos + 12] = ct - st;

			ts2 = (_in[7] - _in[1]) * cx[12 + 6];
			tc6 = _in[13] - tc6 * cx[12 + 7];
			ct = tc5 * cx[12 + 3] - tc6 + tc7 * cx[12 + 4] + tc8 * cx[12 + 5];
			st = ts1 * cx[12 + 2] + ts2 + ts3 * cx[12 + 0] + ts4 * cx[12 + 1];
			out[outPos + 3] = ct + st;
			out[outPos + 4] = ct - st;

			ct = -tc5 * cx[12 + 5] + tc6 - tc7 * cx[12 + 3] - tc8 * cx[12 + 4];
			st = ts1 * cx[12 + 1] + ts2 - ts3 * cx[12 + 2] - ts4 * cx[12 + 0];
			out[outPos + 7] = ct + st;
			out[outPos + 8] = ct - st;

			ct = -tc5 * cx[12 + 4] + tc6 - tc7 * cx[12 + 5] - tc8 * cx[12 + 3];
			st = ts1 * cx[12 + 0] - ts2 + ts3 * cx[12 + 1] - ts4 * cx[12 + 2];
			out[outPos + 15] = ct + st;
			out[outPos + 16] = ct - st;
		}
	}

	this.mdct_sub48 = function(gfc, w0, w1) {
		var wk = w0;
		var wkPos = 286;
		/* thinking cache performance, ch->gr loop is better than gr->ch loop */
		for (var ch = 0; ch < gfc.channels_out; ch++) {
			for (var gr = 0; gr < gfc.mode_gr; gr++) {
				var band;
				var gi = (gfc.l3_side.tt[gr][ch]);
				var mdct_enc = gi.xr;
				var mdct_encPos = 0;
				var samp = gfc.sb_sample[ch][1 - gr];
				var sampPos = 0;

				for (var k = 0; k < 18 / 2; k++) {
					window_subband(wk, wkPos, samp[sampPos]);
					window_subband(wk, wkPos + 32, samp[sampPos + 1]);
					sampPos += 2;
					wkPos += 64;
					/*
					 * Compensate for inversion in the analysis filter
					 */
					for (band = 1; band < 32; band += 2) {
						samp[sampPos - 1][band] *= -1;
					}
				}

				/*
				 * Perform imdct of 18 previous subband samples + 18 current
				 * subband samples
				 */
				for (band = 0; band < 32; band++, mdct_encPos += 18) {
					var type = gi.block_type;
					var band0 = gfc.sb_sample[ch][gr];
					var band1 = gfc.sb_sample[ch][1 - gr];
					if (gi.mixed_block_flag != 0 && band < 2)
						type = 0;
					if (gfc.amp_filter[band] < 1e-12) {
						Arrays.fill(mdct_enc, mdct_encPos + 0,
								mdct_encPos + 18, 0);
					} else {
						if (gfc.amp_filter[band] < 1.0) {
							for (var k = 0; k < 18; k++)
								band1[k][order[band]] *= gfc.amp_filter[band];
						}
						if (type == Encoder.SHORT_TYPE) {
							for (var k = -NS / 4; k < 0; k++) {
								var w = win[Encoder.SHORT_TYPE][k + 3];
								mdct_enc[mdct_encPos + k * 3 + 9] = band0[9 + k][order[band]]
										* w - band0[8 - k][order[band]];
								mdct_enc[mdct_encPos + k * 3 + 18] = band0[14 - k][order[band]]
										* w + band0[15 + k][order[band]];
								mdct_enc[mdct_encPos + k * 3 + 10] = band0[15 + k][order[band]]
										* w - band0[14 - k][order[band]];
								mdct_enc[mdct_encPos + k * 3 + 19] = band1[2 - k][order[band]]
										* w + band1[3 + k][order[band]];
								mdct_enc[mdct_encPos + k * 3 + 11] = band1[3 + k][order[band]]
										* w - band1[2 - k][order[band]];
								mdct_enc[mdct_encPos + k * 3 + 20] = band1[8 - k][order[band]]
										* w + band1[9 + k][order[band]];
							}
							mdct_short(mdct_enc, mdct_encPos);
						} else {
							var work = new_float(18);
							for (var k = -NL / 4; k < 0; k++) {
								var a, b;
								a = win[type][k + 27]
										* band1[k + 9][order[band]]
										+ win[type][k + 36]
										* band1[8 - k][order[band]];
								b = win[type][k + 9]
										* band0[k + 9][order[band]]
										- win[type][k + 18]
										* band0[8 - k][order[band]];
								work[k + 9] = a - b * tantab_l[3 + k + 9];
								work[k + 18] = a * tantab_l[3 + k + 9] + b;
							}

							mdct_long(mdct_enc, mdct_encPos, work);
						}
					}
					/*
					 * Perform aliasing reduction butterfly
					 */
					if (type != Encoder.SHORT_TYPE && band != 0) {
						for (var k = 7; k >= 0; --k) {
							var bu, bd;
							bu = mdct_enc[mdct_encPos + k] * ca[20 + k]
									+ mdct_enc[mdct_encPos + -1 - k]
									* cs[28 + k];
							bd = mdct_enc[mdct_encPos + k] * cs[28 + k]
									- mdct_enc[mdct_encPos + -1 - k]
									* ca[20 + k];

							mdct_enc[mdct_encPos + -1 - k] = bu;
							mdct_enc[mdct_encPos + k] = bd;
						}
					}
				}
			}
			wk = w1;
			wkPos = 286;
			if (gfc.mode_gr == 1) {
				for (var i = 0; i < 18; i++) {
					System.arraycopy(gfc.sb_sample[ch][1][i], 0,
							gfc.sb_sample[ch][0][i], 0, 32);
				}
			}
		}
	}
}

module.exports = NewMDCT;