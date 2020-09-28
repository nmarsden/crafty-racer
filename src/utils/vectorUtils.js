export let VectorUtils = {
    // Finds the normal point from p to a line segment defined by points a and b
    getNormalPoint: function(p, a, b) {
        var ap = p.clone().subtract(a);
        var ab = b.clone().subtract(a);
        ab.normalize();
        ab.scale(ap.dotProduct(ab));
        return a.clone().add(ab);
    },

    // Rotates the point about the given pivot point
    rotate: function(point, pivot, angle) {
        var translatedToPivot = point.clone().subtract(pivot);
        return (new Matrix2D()).rotate(angle * (Math.PI / 180)).apply(translatedToPivot).add(pivot);
    }

};
