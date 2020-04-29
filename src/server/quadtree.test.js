const QuadTree = require('./quadtree');


describe('QuadTree', () => {
  it('should work', () => {
    const tree = new QuadTree(0, { x: 0, y: 0, width: 800, height: 800 });
    tree.clear();

    const objects = [
      { x: 10, y: 10, width: 10, height: 10 },
      { x: 15, y: 10, width: 10, height: 10 },
      { x: 20, y: 15, width: 10, height: 10 },
      { x: 600, y: 400, width: 10, height: 10 },
      { x: 650, y: 410, width: 10, height: 10 },
      { x: 780, y: 780, width: 10, height: 10 },
    ];

    objects.forEach(element => {
      tree.insert(element);
    });

    expect(true).toBeTruthy();
    // console.log(JSON.stringify(tree.getTree(), null, 2));
  });
});
