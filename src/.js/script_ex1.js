//hint from the teacher
    //function addEltToSVG. It's used to add an SVG element to the specified SVG container. 
    //the function creates a new SVG element (specified by name) and sets its attributes based on the attrs object.
    function addEltToSVG(svg, name, attrs) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", name);
        if (attrs === undefined) attrs = {};
        for (var key in attrs) {
            element.setAttributeNS(null, key, attrs[key]);
        }
        svg.appendChild(element);
    }

    //function to create a histogram
    //generate a histogram in the provided SVG container based on the given name.
    function createHistogram(svgElt, name) {
        //define the histogram bins and initialize bin heights
        //array bins represents character ranges (A-D, E-H, etc.), with six bins (A-D, E-H, I-L, M-P, Q-U, V-Z)
        //array binHeights represents the initial heights for each bin.
        var bins = ['A-D', 'E-H', 'I-L', 'M-P', 'Q-U', 'V-Z'];
        //initialize all bins to 1
        var binHeights = [1, 1, 1, 1, 1, 1];

        //convert the name to uppercase for case-insensitive comparison
        //(https://developer.mozilla.org/enUS/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase) 
        name = name.toUpperCase();

        //for loop to count the characters in each bin
        //this loop counts how many characters from the name fall into each bin. 
        //if a character falls within a specified range (e.g., A-D), 
        //the height of that bin is increased by 50 pixels.
        for (var i = 0; i < name.length; i++) {
            var char = name[i];
            for (var j = 0; j < bins.length; j++) {
                var range = bins[j];
                var startChar = range.charAt(0);
                var endChar = range.charAt(2);
                if (char >= startChar && char <= endChar) {
                    binHeights[j] += 50; //increase the bin height by 50 pixels
                    break; //exit the inner loop
                }
            }
        }

        //draw the histogram bars
        //for loop to draw the bars
        //loop iterates through the bins, and for each bin, it calculates the X position (binX) and the height of the bar (binHeight). 
        //then ddEltToSVG function to create SVG <rect> elements to represent the bars of the histogram. 
        //the attributes specify the position, dimensions, and color of the bars.
        for (var k = 0; k < bins.length; k++) {
            var binX = k * 50;
            var binHeight = binHeights[k];
            addEltToSVG(svgElt, 'rect', {
                x: binX,
                y: 400 - binHeight, //invert the y-coordinate to start from the top
                width: 50, //50 pixels wide
                height: binHeight,
                //the bars should be filled with a blue color and the lines drawn in black.
                fill: 'blue',
                stroke: 'black'
            });
        }
    }

    //hint from the teacher
    //use JavaScript's document.getElementById 
    //(https://developer.mozilla.org/enUS/docs/Web/API/document.getElementById) function to get a reference to the SVG element
    //get the SVG element and create the histogram
    window.onload = function () {
        var svgElement = document.getElementById("histogram");
        createHistogram(svgElement, "Tung");
    };