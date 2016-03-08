/**
 * Matrix Class
 * an affine transformation matrix, and supply some methods.
 *
 * @author Junichi Honda
 * @class
 */
var Matrix = (function(){

  'use strict';

  var p = Matrix.prototype;
  var s = Matrix;
  /**
   * @static
   * @readonly
   */
  s.DEG_TO_RAD = Math.PI / 180;

  /**
   * this matrix can be like this:
   *      [ a  c  tx
   *        b  d  ty
   *        0  0  1]
   *
   * @class Matrix
   * @param a {number}
   * @param b {number}
   * @param c {number}
   * @param d {number}
   * @param tx {number}
   * @param ty {number}
   * @constructor
   */
  function Matrix(a, b, c, d, tx, ty) {
      if(typeof a === 'undefined') a = 1;
      if(typeof b === 'undefined') b = 0;
      if(typeof c === 'undefined') c = 0;
      if(typeof d === 'undefined') d = 1;
      if(typeof tx === 'undefined') tx = 0;
      if(typeof ty === 'undefined') ty = 0;

      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
  }

  /**
   * append the matrix properties to this matrix.
   * @param a {number}
   * @param b {number}
   * @param c {number}
   * @param d {number}
   * @param tx {number}
   * @param ty {number}
   * @public
   */
  p.append = function(a, b, c, d, tx, ty){
    var _a = this.a,
        _b = this.b,
        _c = this.c,
        _d = this.d;

    if (a != 1 || b != 0 || c != 0 || d != 1) {
      this.a = _a * a + _c * b;
      this.b = _b * a + _d * b;
      this.c = _a * c + _c * d;
      this.d = _b * c + _d * d;
    }

    this.tx = _a * tx + _c * ty + this.tx;
    this.ty = _b * tx + _d * ty + this.ty;
  };

  /**
   * prepend the matrix properties to this matrix.
   * @param a {number}
   * @param b {number}
   * @param c {number}
   * @param d {number}
   * @param tx {number}
   * @param ty {number}
   * @public
   */
  p.prepend = function(a, b, c, d, tx, ty){
    var _a = this.a,
        _c = this.c,
        _tx = this.tx;

      this.a  = a * _a + c * this.b;
      this.b  = b * _a + d * this.b;
      this.c  = a * _c + c * this.d;
      this.d  = b * _c + d * this.d;
      this.tx = a * _tx + c * this.ty + tx;
      this.ty = b * _tx + d * this.ty + ty;
  };

  p.appendMatrix = function(matrix){
    this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.d, matrix.tx, matrix.ty);
  };

  p.prependMatrix = function(matrix){
    this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.d, matrix.tx, matrix.ty);
  }

  /**
   * inverts the matrix.
   */
  p.invert = function(){
    var _a = this.a,
        _b = this.b,
        _c = this.c,
        _d = this.d,
        _tx = this.tx,
        _n = _a * _d - _b * _c;

    this.a = _d / _n;
    this.b = -_b / _n;
    this.c = -_c / _n;
    this.d = _a / _n;
    this.tx = (_c * this.ty - _d * _tx) / _n;
    this.ty = -(_a * this.ty - _b * _tx) / _n;
  };

  /**
   * translate the matrix on the X & Y
   * @param   x   {number}      axis X
   * @param   y   {number}      axis Y
   */
  p.translate = function(x, y){
    this.tx += this.a * x + this.c * y;
    this.ty += this.b * x + this.d * y;
  };

  /**
   * implement a scale transform to the matrix.
   */
  p.scale = function(x, y){
    this.a *= x;
    this.b *= x;
    this.c *= y;
    this.d *= y;
  };

  /**
   * implement a rotate transform to the matrix.
   */
  p.rotate = function(angle){
    angle = angle * s.DEG_TO_RAD;
    var _cos = Math.cos(angle),
        _sin = Math.sin(angle),
        _a = this.a,
        _b = this.b;

    this.a = _a * _cos + this.c * _sin;
    this.b = _b * _cos + this.d * _sin;
    this.c = -_a * _sin + this.c * _cos;
    this.d = -_b * _sin + this.d * _cos;
  };

  /**
   * decompose the matrix into transform.
   * @param   target      {HTMLElement}     DOM Object
   */
  p.decomposeStyle = function(target){
      if(target === null || typeof target === 'undefined') {
        return;
      }
      var _sqrt = Math.sqrt,
          _atan2 = Math.atan2,
          _scaleX = _sqrt(this.a * this.a + this.b * this.b),
          _scaleY = _sqrt(this.c * this.c + this.d * this.d),
          _skewX = _atan2(-this.c, this.d),
          _skewY = _atan2(this.b, this.a),
          _delta = Math.abs(1 - _skewX / _skewY),
          _rotation = 0;

      if(_delta < 0.00001) {
        _rotation = _skewY / s.DEG_TO_RAD;
        if(this.a < 0 && this.d >= 0){
          _rotation += (_rotation <= 0) ? 180 : -180;
        }
        _skewX = _skewY = 0;
      } else {
        _skewX = _skewX / s.DEG_TO_RAD;
        _skewY = _skewY / s.DEG_TO_RAD;
      }

      p.rotate(_rotation);
      p.scale(_scaleX, _scaleY);

      var _style = target.style,
        _prefix = checkPropPrefix('transform');
      // matrix(a, b, c, d, tx, ty);
      _style[_prefix] = 'matrix(' + this.a + ', ' + this.b + ', ' + this.c + ', ' + this.d + ', ' + this.tx + ', ' + this.ty + ')';
  };

  /**
   * a clone of matrix instance.
   */
  p.clone = function(){
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
  };

  /**
   * Sets the properties of the matrix to those of an identity matrix.
   */
  p.identity = function(){
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
  };

  /**
   * check prefix of style property.
   * @private
   */
  var checkPropPrefix = function(q, e){
    var _tmpDiv = document.createElement('div');
    e = e || _tmpDiv;
    var s = e.style, a, i;
    var _prefix = '';
    if(s[q] !== void 0) {
      return q;
    }
    q = q.charAt(0).toUpperCase() + q.substr(1);
    a = ['O', 'Moz', 'ms', 'MS', 'Webkit'];
    i = 5;
    while (--i > -1 && s[a[i] + q] === void 0) {}
    if(i >= 0) {
      _prefix = (i === 3) ? 'ms' : a[i];
      return _prefix + q;
    }
    return null;
  };

  return Matrix;
})();
