/**
 * Definition of directions for each of the tans, the anchor point for each piece
 * is at position x, the directions are defined in clockwise order (except for
 * the flipped parallelogram) and are the vectors to the points a,b,(c), where c
 * is only for four-sided tans, the pieces are all constructed from 16 basic
 * triangles, so that the square built from all 7 pieces has a side length of 4
 * x---a  x----a  x-----a        c-----b
 * |  /   |    |   \     \      /     /
 * | /    |    |    \     \    /     /
 * b      c----b     c-----b  x-----a
 */
var Directions = [];
var InsideDirections = [];
var SegmentDirections = [];
var numOrientations = 8;

// Create Array for each tan piece
for (var index = 0; index <= 5; index++) {
    InsideDirections[index] = [];
    Directions[index] = [];
    SegmentDirections[index] = [];
}
// Fill the first entry of each array with the direction vectors for when
// a piece is not rotated
Directions[0][0] =
    [new Point(new IntAdjoinSqrt2(0, 2), new IntAdjoinSqrt2(0, 0)),
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 2))];
//InsideDirections[0][0] = new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 1));
Directions[1][0] =
    [new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(0, 0)),
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(2, 0))];
//InsideDirections[1][0] = new Point(new IntAdjoinSqrt2(0.5, 0), new IntAdjoinSqrt2(0.5, 0));
Directions[2][0] =
    [new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 0)),
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1))];
//InsideDirections[2][0] = new Point(new IntAdjoinSqrt2(0, 0.25), new IntAdjoinSqrt2(0, 0.25));
Directions[3][0] =
    [new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 0)),
        new Point(new IntAdjoinSqrt2(0, 1), new IntAdjoinSqrt2(0, 1)),
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1))];
//InsideDirections[3][0] = new Point(new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, 0.5));
Directions[4][0] =
    [new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(0, 0)),
        new Point(new IntAdjoinSqrt2(3, 0), new IntAdjoinSqrt2(1, 0)),
        new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(1, 0))];
//InsideDirections[4][0] = new Point(new IntAdjoinSqrt2(1.5,0), new IntAdjoinSqrt2(0.5,0));
Directions[5][0] =
    [new Point(new IntAdjoinSqrt2(2, 0), new IntAdjoinSqrt2(0, 0)),
        new Point(new IntAdjoinSqrt2(3, 0), new IntAdjoinSqrt2(-1, 0)),
        new Point(new IntAdjoinSqrt2(1, 0), new IntAdjoinSqrt2(-1, 0))];
//InsideDirections[5][0] = new Point(new IntAdjoinSqrt2(1.5,0), new IntAdjoinSqrt2(-0.5,0));
for (var tanTypeId = 0; tanTypeId <= 5; tanTypeId++) {
    var centerPoint = new Point();
    for (var pointId = 0; pointId < Directions[tanTypeId][0].length; pointId++) {
        centerPoint.add(Directions[tanTypeId][0][pointId]);
    }
    centerPoint.scale(1 / (Directions[tanTypeId][0].length + 1));
    InsideDirections[tanTypeId][0] = [];
    InsideDirections[tanTypeId][0][0] = centerPoint;
}
for (tanTypeId = 0; tanTypeId <= 1; tanTypeId++){
    var middle1 = Directions[tanTypeId][0][0].dup().add(Directions[tanTypeId][0][1]).scale(0.5);
    var middle2 = Directions[tanTypeId][0][0].dup().scale(0.5);
    var middle3 = Directions[tanTypeId][0][1].dup().scale(0.5);
    var insidePoint1 = Directions[tanTypeId][0][0].dup().add(middle1);
    var insidePoint2 = Directions[tanTypeId][0][1].dup().add(middle2);
    var insidePoint3 = middle3.add(middle3);
    insidePoint1.scale(1 / (Directions[tanTypeId][0].length));
    InsideDirections[tanTypeId][0][1] = insidePoint1;
    insidePoint2.scale(1 / (Directions[tanTypeId][0].length));
    InsideDirections[tanTypeId][0][2] = insidePoint2;
    insidePoint3.scale(1 / (Directions[tanTypeId][0].length));
    InsideDirections[tanTypeId][0][3] = insidePoint3;
}

for (tanTypeId = 3; tanTypeId <= 5; tanTypeId++){
     insidePoint1 = new Point();
     insidePoint2 = new Point();
    for ( pointId = 0; pointId < Directions[tanTypeId][0].length; pointId++) {
        if (pointId != Directions[tanTypeId][0].length-1){
            insidePoint1.add(Directions[tanTypeId][0][pointId]);
        }
        insidePoint2.add(Directions[tanTypeId][0][pointId])
    }
    insidePoint1.scale(1 / (Directions[tanTypeId][0].length));
    InsideDirections[tanTypeId][0][1] = insidePoint1;
    insidePoint2.scale(1 / (Directions[tanTypeId][0].length));
    InsideDirections[tanTypeId][0][2] = insidePoint2;
}
/* Matrix for rotating by 45 degrees */
var rotationMatrix =
    [[new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, -0.5), new IntAdjoinSqrt2(0, 0)],
        [new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, 0.5), new IntAdjoinSqrt2(0, 0)],
        [new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)]];
/* For each type, rotate the direction vectors of orientation orientId by 45
 * degrees to get the direction vectors for orientation orientId+1 */
for (tanTypeId = 0; tanTypeId <= 5; tanTypeId++) {
    for (var orientId = 0; orientId < 7; orientId++) {
        Directions[tanTypeId][orientId + 1] = [];
        InsideDirections[tanTypeId][orientId + 1] = [];
        for (var pointId = 0; pointId < InsideDirections[tanTypeId][orientId].length; pointId++) {
            InsideDirections[tanTypeId][orientId + 1][pointId] = InsideDirections[tanTypeId][orientId][pointId].dup().transform(rotationMatrix);
        }
        for (var dir = 0; dir < Directions[tanTypeId][0].length; dir++) {
            Directions[tanTypeId][orientId + 1][dir] =
                Directions[tanTypeId][orientId][dir].dup().transform(rotationMatrix);
        }
    }
}

/* */
for (tanTypeId = 0; tanTypeId <= 5; tanTypeId++) {
    for (orientId = 0; orientId <= 7; orientId++) {
        SegmentDirections[tanTypeId][orientId] = [];
        /* Anchor point, take first and last direction */
        SegmentDirections[tanTypeId][orientId][0] =
            [Directions[tanTypeId][orientId][0].dup(), Directions[tanTypeId]
                [orientId][(tanTypeId < 3) ? 1:2].dup()];
        /* First point, take negated direction to the point from the anchor, for
         * the second segment, add Direction to the second point to the direction
         * for the first segment */
        SegmentDirections[tanTypeId][orientId][1] =
            [Directions[tanTypeId][orientId][0].dup().neg(),
                Directions[tanTypeId][orientId][0].dup().neg().add(Directions
                    [tanTypeId][orientId][1].dup())];
        /* Second point, calculation depends on tan type, for three-sided tans
         * handle the same way as first point, for four-sided tans first calculate
         * direction to the anchor, then add respective direction vectors */
        if (tanTypeId < 3){
            SegmentDirections[tanTypeId][orientId][2] =
                [Directions[tanTypeId][orientId][1].dup().neg(),
                    Directions[tanTypeId][orientId][1].dup().neg().add(Directions
                        [tanTypeId][orientId][0].dup())];
        } else {
            var toAnchor = Directions[tanTypeId][orientId][1].dup().neg();
            SegmentDirections[tanTypeId][orientId][2] =
                [Directions[tanTypeId][orientId][0].dup().add(toAnchor),
                    Directions[tanTypeId][orientId][2].dup().add(toAnchor)];
            /* Third point, handled the same way as second point for three-sided */
            SegmentDirections[tanTypeId][orientId][3] =
                [Directions[tanTypeId][orientId][2].dup().neg(),
                    Directions[tanTypeId][orientId][2].dup().neg().add(Directions
                        [tanTypeId][orientId][1].dup())];
        }
    }
}

var FlipDirections = [[new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-1, 0)), /* 0 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1)), /* 1 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(3, 0)), /* 2 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 2)), /* 3 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)), /* 4 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -1)), /* 5 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-3, 0)), /* 6 */
    new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -2))], /* 7 */
    [new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(1, 0)), /* 0 */
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 2)), /* 1 */
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(3, 0)), /* 2 */
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, 1)), /* 3 */
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-1, 0)), /* 4 */
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -2)), /* 5 */
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(-3, 0)), /* 6 */
        new Point(new IntAdjoinSqrt2(0, 0), new IntAdjoinSqrt2(0, -1))]];
/* 7 */