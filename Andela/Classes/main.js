class Rectangle {
    constructor(height,width){
        this._height = height;
        this._width = width;
    }

    get area(){
        return this.calcArea();
    }

    calcArea() {
        return this.height * this.width;
    }

    static perimeter(a ,b){
        return (2*a)+(2*b);
    }
}