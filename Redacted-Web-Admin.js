if (Meteor.isClient) {
    Meteor.startup(function() {
        (function() {
            var canvas = document.getElementById('canvas'),
                context = canvas.getContext('2d');

            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeCanvas, false);

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                /**
                 * Your drawings need to be inside this function otherwise they will be reset when
                 * you resize the browser window and the canvas goes will be cleared.
                 */
            }
            resizeCanvas();
        })();

        HTTP.get("https://docs.google.com/spreadsheet/pub?key=0AiDNCTQTPivpdDczclhlMzFOdEtmbEowTTNTSDM0U1E&output=txt",function(e,r) {
            if (r.content) {
                var g =  new Springy.Graph();
                var data = {};
                var lines = r.content.split("\n");
                for (var i = 1; i < lines.length; i++) {
                    var parse = lines[i].split("\t");
                    var firstChildLabel = parse[0];
                    var secondChildLabel = parse[1];
                    var parentLabel = parse[2];
                    if (!_.contains(_.keys(data),firstChildLabel)) {
                        data[firstChildLabel] = g.newNode({label:firstChildLabel});
                    }
                    if (!_.contains(_.keys(data),secondChildLabel)) {
                        data[secondChildLabel] = g.newNode({label:secondChildLabel});
                    }
                    if (!_.contains(_.keys(data),parentLabel)) {
                        data[parentLabel] = g.newNode({label:parentLabel});
                    }
                    g.newEdge(data[firstChildLabel],data[parentLabel]);
                    g.newEdge(data[secondChildLabel],data[parentLabel]);
                }

                $('#canvas').springy({graph:g, stiffness:0, repulsion:1, damping:0});
            }
        });

    });
}