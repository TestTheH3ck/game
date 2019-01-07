import world from '../core/world';
import UI from 'shared/ui';

class MapUtils {
  static gridWalkable(tiles, player, onTile, row = 0, column = 0) {
    // TODO - Refactor
    // Cover your eyes, probably the ugliest code
    // I have written in my life. I am so sorry.
    // What's going on here? FG & BG collision
    let walkableTile = 0;

    // Get walkable status of both foreground and background tiles
    const walkable = {
      fg: UI.tileWalkable(tiles.foreground, 'foreground'),
      bg: UI.tileWalkable(tiles.background),
    };

    // Is the foreground not walkable?
    if (!walkable.fg) {
      walkableTile = 1; // Nope
    }

    // Is the foreground AND background walkable?
    if (walkable.fg && walkable.bg) {
      walkableTile = 0; // Yep.
    }

    // Is the foreground NOT walkable BUT the background is?
    if (!walkable.fg && walkable.bg) {
      walkableTile = 1;
    }

    // Is the foreground walkable BUT the background is not?
    if (walkable.fg && !walkable.bg) {
      // Is there no foreground tile?
      if ((world.map.foreground[onTile] - 1) === -1) {
        walkableTile = 1;
      } else {
        // If there is, then it is (because the BG is not walkable).
        walkableTile = 0;
      }
    }

    // If the action requires us to be on the "edge" of a tile
    // (eg: resource gathering, action tile, door push, etc.)
    // then let us temporarily make it 'walkable' so the pathfinding does its job
    // and then we will simply snip of the last step of the path so we are right next ot it.
    if (player.action && player.action.nearby === 'edge' && player.action.coordinates.x === row && player.action.coordinates.y === column) {
      walkableTile = 0;
    }

    return walkableTile;
  }
}

export default MapUtils;