export default function fontSizeAdjuster(setterFunc, width){
    // let adjustedFont = (16 * Math.pow(100, k))/Math.pow(width, k);
    let adjustedFont = 1000/width;
    adjustedFont = parseFloat(boundFontSize(adjustedFont))+"px";
    setterFunc(adjustedFont);
}
function boundFontSize(fontSize){
    if(fontSize > 50){
        return 50;
    }
    if(fontSize < 1){
        return 1;
    }
    return fontSize;
}