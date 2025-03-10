import { RpgServer, RpgModule } from '@rpgjs/server'
import { Potion } from './fixtures/item'
import { Sword } from './fixtures/weapons'
import { Confuse } from './fixtures/state'
import { Fire } from './fixtures/skill'
import {_beforeEach} from './beforeEach'
import { clear } from '@rpgjs/testing'

let  client, player, fixture, playerId

@RpgModule<RpgServer>({
    database: {
        Potion,
        Sword,
        Confuse,
        Fire
    }
})
class RpgServerModule {}

const modules = [
    {
        server: RpgServerModule
    }
]

beforeEach(async () => {
    const ret = await _beforeEach(modules)
    client = ret.client
    player = ret.player
    fixture = ret.fixture
    playerId = ret.playerId
})

test('Test Save', () => {
    player.addItem(Potion)
    player.setVariable('TEST', true)
    const json = player.save()
    const obj = JSON.parse(json)
    expect(obj.items).toMatchObject({"0": {"item": {"id": "potion", "name": "Potion", "price": 100}, "nb": 1}})
    expect(obj.variables).toHaveLength(1)
})


test('Test Load', () => {
    player.addItem(Potion)
    player.addItem(Sword)
    player.equip(Sword)
    player.addState(Confuse)
    player.learnSkill(Fire)
    player.setVariable('TEST', true)
    player.statesEfficiency = [{ rate: 1, state: Confuse }]
    const json = player.save()
    player.removeItem(Potion)
    player.equip(Sword, false)
    player.removeState(Confuse)
    player.forgetSkill(Fire)
    player.removeVariable('TEST')
    player.load(json)
    expect(player).toHaveProperty('items.0.item.hpValue')
    expect(player).toHaveProperty('equipments.0.atk')
    expect(player).toHaveProperty('equipments.0.equipped')
    expect(player.equipments[0].equipped).toBeTruthy()
    expect(player).toHaveProperty('states.0.effects')
    expect(player).toHaveProperty('skills.0.power')
    expect(player.statesEfficiency[0]).toHaveProperty('rate', 1)
    expect(player.statesEfficiency[0].state).toHaveProperty('id', 'confuse')
    expect(player.getVariable('TEST')).toBe(true)
})

describe('Custom Save / Load', () => {
    test('Prop', async () => {
        clear()
    
        @RpgModule<RpgServer>({
            player: {
                props: {
                    wood: true
                }
            }
        })
        class RpgServerCustomModule {}
    
        const { player } = await _beforeEach([
            {
                server: RpgServerCustomModule
            }
        ])

        player.wood = 5

        const json = player.save()
        const obj = JSON.parse(json)
        expect(obj).toHaveProperty('wood', 5)

        player.wood = 15

        player.load(json)
        expect(player.wood).toBe(5)
    })
})


afterEach(() => {
    clear()
})