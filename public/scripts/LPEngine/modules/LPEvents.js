//test function, takes in window object of the DOM then attaches a mousemove event listener to it.
export function LPEventsInit(_window){
    _window.addEventListener('mousemove', function (event) {
        console.log('Mouse moved!');
        console.log('X: '+ event.clientX + ', Y: ' + event.clientY);
    });
}