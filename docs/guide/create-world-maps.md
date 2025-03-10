# Step 3b. Create several attached maps in one world

## Prerequisites

- Have version 3.0.0-beta.8+
- Use Tiled Map Editor, and mainly the [World tool](https://doc.mapeditor.org/en/stable/manual/worlds)

## Why ?

The interest is to teleport the player on an adjacent map on consistent X and Y positions. You can also use a hook to tell if the player can change map or not

<Video src="/assets/rpgjs_world.mp4" /> 

## Preparing the world in the editor

Click on `World > New World` and add a file ending with the extension `.world` in <Path to="tmxDir" />

![create world](/assets/tiled-world.png)

Next, add maps to the world

![add in world](/assets/tiled-add-in-world.png)

1. Click on World Tool
2. Add the current map to a loaded

Place the maps so that the edges are touching

![tiled world](/assets/tiled-world-2.png)

## Add the world to your game

In <PathTo to="serverIndex" /> :

```ts
import { RpgServer, RpgModule } from '@rpgjs/server'
import myworld from './maps/tmx/myworld.world'

@RpgModule<RpgServer>({
    worldMaps: [
        myworld
    ]
})
export default class RpgServerEngine { }
```

::: tip
The world creates maps automatically and the map ID will be the file name. Be aware that if you already have a map with the same ID, the world will use this map
:::

::: tip
To quickly add a sound, add a personality property to the map (in Tiled Map Editor) named sounds. Put the sound ID of the resource, client side (see [Create Sound](/guide/create-sound.html))

![tiled world](/assets/map-sound.png)
:::

## Bonus. Prevent map change

There are several reasons for this. For example, 
1. you can check that the character is on a dirt road (by looking at the tile ID)
2. You can make a scenario, if the player doesn't have the level, he can't change the map,
3. etc.

<Video src="/assets/rpgjs_world_2.mp4" /> 

Go to <Path to="playerFile" /> and add `canChangeMap()` hook

```ts
import { RpgPlayer, RpgPlayerHooks, RpgClassMap, RpgMap } from '@rpgjs/server'

export const player: RpgPlayerHooks = {
    // others hooks here...
    async canChangeMap(player: RpgPlayer, nextMap: RpgClassMap<RpgMap>): Promise<boolean> {
        if (nextMap.id == '<id of next map here>' && player.level < 10) {
            await player.showText('You can\'t go in that direction yet. You must have level 10 minimum!')
            return false
        }
        return true
    }
}
```

> Note that `nextMap` is not of type `RpgMap` because it is not loaded yet. It's only the class, so you can't get everything from it, e.g. the data of the next map