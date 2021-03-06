const Constants = require('../shared/constants');

// Consider others implementations (possible more efficients)
// https://github.com/pdehn/jsQuad
// https://github.com/mikechambers/ExamplesByMesh/tree/master/JavaScript/QuadTree/examples
// https://github.com/timohausmann/quadtree-js XX(this implementation in javascript??)
// https://github.com/CorentinTh/quadtree-js
/*
stackoverflow.com/questions/41946007/efficient-and-well-explained-implementation-of-a-quadtree-for-2d-collision-det
*/

// naive Implementation
class QuadTree {
  constructor(level, bounds) {
    this.maxObjects = Constants.QUADTREE_MAXOBJECTS;
    this.maxLevels = Constants.QUADTREE_MAXLEVELS;

    this.level = level;
    this.bounds = bounds;
    this.nodes = [];
    this.objects = [];
  }

  clear() {
    this.objects = [];

    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] != null) {
        this.nodes[i].clear();
        this.nodes[i] = null;
      }
    }
  }

  split() {
    const subWidth = this.bounds.width / 2;
    const subHeight = this.bounds.height / 2;
    const sx = this.bounds.x;
    const sy = this.bounds.y;

    this.nodes[0] = new QuadTree(this.level + 1, { x: sx + subWidth, y: sy, width: subWidth, height: subHeight });
    this.nodes[1] = new QuadTree(this.level + 1, { x: sx, y: sy, width: subWidth, height: subHeight });
    this.nodes[2] = new QuadTree(this.level + 1, { x: sx, y: sy + subHeight, width: subWidth, height: subHeight });
    this.nodes[3] = new QuadTree(this.level + 1, {
      x: sx + subWidth,
      y: sy + subHeight,
      width: subWidth,
      height: subHeight,
    });
  }

  /*
   * Determine which node the object belongs to. -1 means
   * object cannot completely fit within a child node and is part
   * of the parent node
   */
  getIndex(rectObject) {
    let index = -1;
    const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
    const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    // Object can completely fit within the top quadrants
    const topQuadrant = rectObject.y < horizontalMidpoint && rectObject.y + rectObject.height < horizontalMidpoint;
    // Object can completely fit within the bottom quadrants
    const bottomQuadrant = rectObject.x > horizontalMidpoint;

    // Object can completely fit within the left quadrants
    if (rectObject.x < verticalMidpoint && rectObject.x + rectObject.width < verticalMidpoint) {
      if (topQuadrant) index = 1;
      else if (bottomQuadrant) index = 2;
    } else if (rectObject.x > verticalMidpoint) { // Object can completely fit within the right quadrants
      if (topQuadrant) index = 0;
      else if (bottomQuadrant) index = 3;
    }

    return index;
  }

  /*
   * Insert the object into the quadtree. If the node
   * exceeds the capacity, it will split and add all
   * objects to their corresponding nodes.
   */
  insert(customObject) {
    if (this.nodes[0] != null) {
      const index = this.getIndex(customObject);

      if (index !== -1) {
        this.nodes[index].insert(customObject);
        return;
      }
    }

    this.objects.push(customObject);

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      if (this.nodes[0] == null) {
        this.split();
      }

      let i = 0;
      while (i < this.objects.length) {
        const index = this.getIndex(this.objects[i]);
        if (index !== -1) {
          const object = this.objects.splice(i, 1);
          this.nodes[index].insert(object[0]);
        } else i++;
      }
    }
  }

  retrieve2(bounds) {
    let returnObjects = [];
    const index = this.getIndex(bounds);
    if (index !== -1 && this.nodes[0] != null) {
      returnObjects = [...returnObjects, ...this.nodes[index].retrieve2(bounds)];
    }

    if (this.objects.length !== 0) returnObjects = [...returnObjects, ...this.objects];
    return returnObjects;
  }

  getTree() {
    if (!this.nodes.length) {
      return {
        bounds: this.bounds,
        level: this.level,
        objects: this.objects.slice(),
      };
    }

    const innerNodes = [];
    for (let i = 0; i < this.nodes.length; i++) {
      innerNodes.push(this.nodes[i].getTree());
    }

    return {
      bounds: this.bounds,
      level: this.level,
      innerNodes: innerNodes.slice(),
    };
  }

  retrieve(pRect) {
    const indexes = this.getIndex(pRect);
    let returnObjects = this.objects;

    // if we have subnodes, retrieve their objects
    if (this.nodes.length) {
      for (let i = 0; i < indexes.length; i++) {
        returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(pRect));
      }
    }

    return returnObjects
      .filter((item, index) => returnObjects.indexOf(item) >= index);
  }
}

module.exports = QuadTree;
