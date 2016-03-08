class Matrix{
  static get DEG_TO_RAD(){
    return Math.PI / 180;
  }

  static get identity(){
    return null;
  }

  /**
   * an affine transformation matrix, and supply some methods.
   * @class Matrix
   * @param   a {number}
   * @param   b {number}
   * @param   c {number}
   * @param   d {number}
   * @param   tx {number}
   * @param   ty {number}
   * @constructor
   */
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0){
    this.set(a, b, c, d, tx, ty);
    this.a = 0;
    this.b = 0;
    this.c = 0;
    this.d = 0;
    this.tx = 0;
    this.ty = 0;
  }

  /**
   * set the init properties
   * @param a {number}
   * @param b {number}
   * @param c {number}
   * @param d {number}
   * @param tx {number}
   * @param ty {number}
   */
  set(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0){
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
  append(a, b, c, d, tx, ty){
    const _a = this.a;
    const _b = this.b;
    const _c = this.c;
    const _d = this.d;
    if(a !== 1 || b !== 0 || c !== 0 || d !== 1){
      this.a = _a * a + _c * b;
      this.b = _b * a + _d * b;
      this.c = _a * c + _c * d;
      this.d = _b * c + _d * d;
    }
    this.tx = _a * tx + _c * ty + this.tx;
    this.ty = _b * tx + _d * ty + this.ty;
  }

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
  prepend(a, b, c, d, tx, ty){
    const _a = this.a;
    const _c = this.c;
    const _tx = this.tx;

    this.a = a * _a + c * this.b;
    this.b = b * _a + d * this.b;
    this.c = a * _c + c * this.d;
    this.d = b * _c + d * this.d;
    this.tx = a * _tx + c * this.ty + tx;
    this.ty = b * _tx + d * this.ty + ty;
  }

  /**
   * append the matrix
   * @param matrix {}
   */
  appendMatrix(matrix){
    return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }

  /**
   * prepend the matrix
   * @param matrix {}
   */
  prependMatrix(matrix){
    return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }

  /**
   * generate matrix properties.
   * @param x {number}
   * @param y {number}
   * @param scaleX {number}
   * @param scaleY {number}
   * @param rotation {number}
   * @param skewX {number}
   * @param skewY {number}
   * @param regX {number}
   * @param regY {number}
   */
  appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY){
    const _cos = Math.cos;
    const _sin = Math.sin;

    let r = 0;
    let cos = 0;
    let sin = 0;
    if(rotation % 360){
      r = rotation * Matrix.DEG_TO_RAD;
      cos = _cos(r);
      sin = _sin(r);
    }else{
      cos = 1;
      sin = 0;
    }

    if(skewX || skewY){
      skewX *= Matrix.DEG_TO_RAD;
      skewY *= Matrix.DEG_TO_RAD;
      this.append(_cos(skewY), _sin(skewY), -_sin(skewX), _cos(skewX), x, y);
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
    }else{
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
    }

    if(regX || regY){
      this.tx -= regX * this.a + regY * this.c;
      this.ty -= regX * this.b + regY * this.d;
    }
  }

  /**
   * a clockwise rotation transform to the matrix.
   * @param angle {number} angle to rotate in degree.
   */
  rotate(angle){
    const _angle = angle * Matrix.DEG_TO_RAD;
    const cos = Math.cos(_angle);
    const sin = Math.sin(_angle);

    const a = this.a;
    const b = this.b;

    this.a = a * cos + this.c * sin;
    this.b = b * cos + this.d * sin;
    this.c = -a * sin + this.c * cos;
    this.d = -b * sin + this.d * cos;
  }

  /**
   * skew transform
   * @param skewX {number}    skewX horizontally in degree.
   * @param skewY {number}    skewY vertically in degree
   */
  skew(skewX, skewY){
    const _skewX = skewX * Matrix.DEG_TO_RAD;
    const _skewY = skewY * Matrix.DEG_TO_RAD;
    this.append(Math.cos(_skewY), Math.sin(_skewY), -Math.sin(_skewX), Math.cos(_skewX), 0, 0);
  }

  /**
   * scale transform
   * @param scaleX {number}
   * @param scaleY {number}
   */
  scale(scaleX, scaleY){
    this.a *= scaleX;
    this.b *= scaleX;
    this.c *= scaleY;
    this.d *= scaleY;
  }

  /**
   * translate transform
   * @param tx {number}
   * @param ty {number}
   */
  translate(tx, ty){
    this.tx += this.a * tx + this.c * ty;
    this.ty += this.b * tx + this.d * ty;
  }

  /**
   * an identity matrix
   */
  identity(){
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
  }

  invert(){
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const tx = this.tx;
    const n = a * d - b * c;

    this.a = d / n;
    this.b = -b / n;
    this.c = -c / n;
    this.d = a / n;
    this.tx = (c * this.ty - d * tx) / n;
    this.ty = -(a * this.ty - b * tx) / n;
  }

  isIdentity(){
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }

  clone(matrix){
    return new Matrix(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }

  /**
   * decompose the matrix to HTMLElement
   * @param target {HTMLElement}
   */
  decomposeStyle(target){
    if(target === null || typeof target === 'undefined'){
      return;
    }
    const sqrt = Math.sqrt;
    const atan2 = Math.atan2;
    const scaleX = sqrt(this.a * this.a + this.b * this.b);
    const scaleY = sqrt(this.c * this.c + this.d * this.d);
    let rotation = 0;
    let skewX = atan2(-this.c, this.d);
    let skewY = atan2(this.b, this.a);
    const delta = Math.abs(1 - skewX / skewY);

    if(delta < 0.00001){
      rotation = skewY / Matrix.DEG_TO_RAD;
      if(this.a < 0 && this.d >= 0){
        rotation += (rotation <= 0) ? 180 : -180;
      }
      skewX = skewY = 0;
    }else{
      skewX = skewX / Matrix.DEG_TO_RAD;
      skewY = skewY / Matrix.DEG_TO_RAD;
    }
    this.rotate(rotation);
    this.scale(scaleX, scaleY);

    const style = target.style;
    style.transform = `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
  }
}
export default Matrix;
