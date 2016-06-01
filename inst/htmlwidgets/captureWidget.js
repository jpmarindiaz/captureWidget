HTMLWidgets.widget({

    name: 'captureWidget',

    type: 'output',

    renderOnNullValue: true,

    initialize: function(el, width, height) {

        return {}
    },

    renderValue: function(el, x, instance) {

        d3.select(el).selectAll("*").remove();
        d3.select("canvas").remove();

        var elementId = x.elementId;
        var opts = x.settings;
        console.log("opts\n", opts)



        var svg = d3.select(el).append("svg");

        if (opts.showButton) {
            // Create an export button
            var x = opts.buttonTop || 10;
            var y = opts.buttonLeft || 10;
            var buttonWidth = opts.buttonWidth || 130;
            var buttonHeight = opts.buttonHeight || 30;

            var button = d3.select(el).select("svg")
                .append("rect")
                .attr("x", x)
                .attr("y", y)
                .attr("width", buttonWidth)
                .attr("height", buttonHeight)
                .attr("id", "svgDownloadButton")
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-width", 2);

            d3.select(el).select("svg").append("text")
                .attr("x", x + buttonWidth / 10)
                .attr("y", y + buttonHeight / 2)
                .attr("dy", ".35em")
                .text(opts.buttonText || "Download Image");

            button.on('click', function() {
                console.log('i was clicked');
                makeSvgCopy(elementId)
                imgDataURL = svgCopyToCanvas("captureSvg")
                downloadFile(imgDataURL)
            });

        }





        console.log("elementId", elementId)

        //Create svg copy container
        var originalWidth = document.getElementById(elementId).offsetWidth,
            originalHeight = document.getElementById(elementId).offsetHeight;
        console.log("originalWidth", originalWidth)

        var captureSvg = d3.select(el)
            .append("div")
            .style("position", "absolute")
            .style("top", "-5000px") // Hide the svg copy
            .attr("id", "captureSvgContainer")
            .attr("width", originalWidth) // set max width? or width of element to copy
            .attr("height", originalHeight) // set max height? or width of element to copy

        function makeSvgCopy(elementId) {
            var element = document.getElementById(elementId);
            if (element) {
                console.log("element", element, element.tagName)
                if (element.tagName == "svg") {
                    // captureSvg
                    //     .append("svg")
                    //     .attr("id", "captureSvg");
                    var clone = element.cloneNode(true);
                    document.getElementById("captureSvgContainer")
                        .appendChild(clone)
                        .setAttribute("id", "captureSvg")
                        .setAttribute("width", originalWidth)
                        .setAttribute("height", originalHeight);
                }

                if (element.tagName == "DIV") {
                    var element = document.querySelectorAll("#" + elementId + " svg")[0];
                    console.log("element", "#" + elementId + " svg", element)
                    captureSvg
                        .append("svg")
                        .attr("id", "captureSvg")
                        .attr("width", originalWidth)
                        .attr("height", originalHeight)
                        ;
                    var clone = element.cloneNode(true);
                    document.getElementById("captureSvg").appendChild(clone);
                }
            }
        }

        function svgCopyToCanvas(elementId) {
            // Select the first svg element
            // console.log("selected SVG", "#" + elementId, d3.select("#" + elementId))

            // var svg = d3.select("#" + elementId)[0][0];
            // console.log("captureSvg Width",d3.select("#captureSvg").style('width'));

            var svg = d3.select("#captureSvg")[0][0];

            // function wait(ms) {
            //     var start = new Date().getTime();
            //     var end = start;
            //     while (end < start + ms) {
            //         end = new Date().getTime();
            //     }
            // }
            if (!svg) {
                if (Shiny) {
                    Shiny.onInputChange("captureWidget_foundSvg", false)
                }
                // console.log('SVG not rendered yet.. waiting 2000ms')
                // wait(2000);
                // var svg = d3.select("#captureSvg")[0][0];
            }


            if (svg) {
                // console.log("captureSvg Width",d3.select("#captureSvg").node().getBBox().width)
                // console.log("captureSvg Width",d3.select("#captureSvgContainer").node().getBoundingClientRect().width)
                var w1 = d3.select("#captureSvg").node().getBBox().width,
                    w2 = d3.select("#captureSvg").node().getBoundingClientRect().width,
                    h1 = d3.select("#captureSvg").node().getBBox().height,
                    h2 = d3.select("#captureSvg").node().getBoundingClientRect().height;

                var w = opts.captureWidth || Math.max(w1, w2), // or whatever your svg width is
                    h = opts.captureHeight || Math.max(h1, h2);
                aspectRatio = w / h;
                console.log("width", w, "height", h)
                if (typeof Shiny !== 'undefined') {
                    Shiny.onInputChange("captureWidget_foundSvg", true)
                    Shiny.onInputChange("captureWidget_aspectRatio", aspectRatio)
                    Shiny.onInputChange("captureWidget_width", w)
                    Shiny.onInputChange("captureWidget_height", h)
                }
                var img = new Image(),
                    serializer = new XMLSerializer(),
                    svgStr = serializer.serializeToString(svg);
                // console.log(svgStr)

                // img.src = 'data:image/svg+xml;base64,' + window.btoa(svgStr);

                // You could also use the actual string without base64 encoding it:
                img.src = "data:image/svg+xml;utf8," + svgStr;

                var canvas = document.createElement("canvas");
                document.body.appendChild(canvas);

                canvas.width = w;
                canvas.height = h;
                canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                var imgDataURL = canvas.toDataURL();
                // console.log(imgDataURL)
                // Send back to shiny
                if (typeof Shiny !== 'undefined') {
                    Shiny.onInputChange("captureWidget_imgDataURL", imgDataURL)
                }
                canvas.style.display = 'none';
                return imgDataURL
            } else {
                if (typeof Shiny !== 'undefined') {
                    Shiny.onInputChange("captureWidget_imgDataURL", null)
                }
                return null
            }

        };

        makeSvgCopy(elementId);
        svgCopyToCanvas(elementId);
        // window.onload = function () { 
        //     console.log("It's loaded!") 
        //     svgCopyToCanvas(elementId)
        // }


    },

    resize: function(el, width, height, instance) {
        // var elementId = x.elementId;
        // var opts = x.settings;
        // makeSvgCopy(elementId);
        // svgCopyToCanvas(elementId)
    }


});
