const writer = require('./writer');

var room_width = 640;
var room_height = 480;
var worldOriginX = room_width / 2;
var worldOriginY = room_height / 2;
var worldDelta = 20; //one unit means 20 pixels, so (-5,2) means (-100,40)

function lp_draw_line(x1, y1, x2, y2, color) {
    //transform the units into the world coordinates
    x1 = worldOriginX + (x1 * worldDelta);
    y1 = worldOriginY - (y1 * worldDelta);
    x2 = worldOriginX + (x2 * worldDelta);
    y2 = worldOriginY - (y2 * worldDelta);

    writer.addCode('draw', 'draw_set_color(' + color + ');');
    writer.addCode('draw', 'draw_line(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ');');
    writer.addCode('draw', 'draw_set_color(c_white);');
}

function lp_draw_screen_grid(width, height, delta, primColor, secColor) {
    //draw grid lines
    //line y-axis lines
    n = height / 2;
    while (true) {
        lp_draw_line(-width / 2, n, width / 2, n, secColor);
        n -= 1;
        if (n < -height / 2) break;
    }
    //line y-axis lines
    n = -width / 2;
    while (true) {
        lp_draw_line(n, height / 2, n, -height / 2, secColor);
        n += 1;
        if (n > width / 2) break;
    }

    //draw the origin
    lp_draw_line(-width / 2, 0, width / 2, 0, primColor);
    lp_draw_line(0, height / 2, 0, -height / 2, primColor);
}

function draw() {
    //draw the coordinate system first
    lp_draw_screen_grid(50,50,worldDelta,'c_black','make_color_rgb(204,204,204)');

    //put draw functions in this function
    lp_draw_line(3, 2, 5, 10, 'c_red');
    lp_draw_line(0, 0, -4, -4, 'c_green');
}

module.exports = {
    draw: draw
}