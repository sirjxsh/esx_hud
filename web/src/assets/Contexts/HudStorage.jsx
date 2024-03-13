import { createContext, onMount, useContext } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { ArmorIcon, DrinkIcon, FoodIcon, HealthIcon, OxygenIcon, StaminaIcon } from '../Icons'

const StateContext = createContext()
const DispatchContext = createContext()

const initialState = {
    status: [
        {
            name: 'healthBar',
            progressLevel: 50,
            color: 'red',
            icon: HealthIcon,
        },
        {
            name: 'armorBar',
            progressLevel: 100,
            color: 'blue',
            icon: ArmorIcon,
        },
        {
            name: 'drinkBar',
            progressLevel: 100,
            color: 'lightblue',
            icon: DrinkIcon,
        },
        {
            name: 'foodBar',
            progressLevel: 100,
            color: 'yellow',
            icon: FoodIcon,
        },
        {
            name: 'oxygenBar',
            progressLevel: 100,
            color: 'pink',
            icon: OxygenIcon,
        },
        {
            name: 'staminaBar',
            progressLevel: 100,
            color: 'green',
            icon: StaminaIcon,
        },
    ],
    speedo: {
        show: false,
        fuel: { level: 50, maxLevel: 100 },
        mileage: 5000,
        kmh: false,
        speed: 0,
        rpm: 100,
        damage: 100,
        vehType: 'LAND',
        driver: false,
        defaultIndicators: {
            seatbelt: false,
            tempomat: true,
            door: false,
            light: false,
            engine: false,
            leftIndex: false,
            rightIndex: false,
        },
    },
    hud: {
        playerId: 1,
        onlinePlayers: 150,
        serverLogo: 'https://esx.s3.fr-par.scw.cloud/blanc-800x800.png',
        moneys: { bank: 75000, money: 100000 },
        job: '',
        weaponData: {
            use: true,
            image: 'pistol',
            name: 'WEAPON NAME',
            currentAmmo: 32,
            maxAmmo: 128,
            isWeaponMelee: true,
        },
        streetName: '',
        voice: { mic: false, radio: false, range: 2 },
    },
    party: [
        {
            name: 'Player 1',
            health: 200,
            armor: 100,
            online: true,
        },
        {
            name: 'Player 2',
            health: 200,
            armor: 100,
            online: true,
        },
        {
            name: 'Player 3',
            health: 200,
            armor: 100,
            online: true,
        },
        {
            name: 'Player 4',
            health: 200,
            armor: 100,
            online: true,
        },
    ],
}
export default function HudStorageProvider(props) {
    const [store, setStore] = createStore(initialState)

    function updateStatus(newValues) {
        store.status.forEach((currentStatus) => {
            setStore(
                'status',
                (currentData) => currentData.name === currentStatus.name,
                produce(
                    (currentData) =>
                        (currentData.progressLevel =
                            newValues[currentStatus.name] !== undefined
                                ? newValues[currentStatus.name]
                                : currentData.progressLevel),
                ),
            )
        })
    }

    function updateParty(newValues) {
        store.party.forEach((currentPlayer, index) => {
            const newValue = newValues[index]
            setStore(
                'party',
                index,
                produce((currentData) => {
                    if (newValue.health && currentData.health !== newValue.health) {
                        currentData.health = newValue.health
                        console.log('health', currentData.health)
                    } else if (newValue.health === 0) {
                        currentData.health = 0
                    }
                    if (newValue.armor && currentData.armor !== newValue.armor) {
                        currentData.armor = newValue.armor
                        console.log('armor', currentData.armor)
                    } else if (newValue.armor === 0) {
                        currentData.armor = 0
                    }
                    if (currentData.online !== newValue.online) {
                        currentData.online = newValue.online
                        if (newValue.online == false) {
                            currentData.health = 0
                            currentData.armor = 0
                        }
                        console.log('online', currentData.online)
                    }
                    if (currentData.name !== newValue.name) {
                        currentData.name = newValue.name
                        console.log('name', currentData.name)
                    }
                }),
            )
        })
    }

    function updateSpeedo(newValues) {
        newValues.speedInDeg = getSpeedInDeg()
        newValues.damageLevel = getDamageLevel()
        setStore('speedo', {
            ...newValues,
            fuel: { ...newValues.fuel },
            defaultIndicators: { ...newValues.defaultIndicators },
        })
    }

    //!!Figyelni kell a nested object-re mert nem fog frissülni a store
    function updateHud(newValues) {
        setStore('hud', {
            ...newValues,
            moneys: { ...newValues.moneys },
            weaponData: { ...newValues.weaponData },
            voice: { ...newValues.voice },
        })
    }

    /*SpeedoTemplate functions*/
    function getSpeedInDeg() {
        const speedInDeg = ((600 / 50) * store.speedo.rpm) / 10

        return `${speedInDeg + 9} 610`
    }

    function getDamageLevel() {
        return `${store.speedo.damage * 1.6} 160`
    }

    /*Voice functions*/
    function changeVoiceRange(newRange) {
        setStore(
            'hud',
            produce((currentData) => (currentData.voice.range = newRange)),
        )
    }

    function currentMicRangeStatus() {
        let micStatus =
            store.hud.voice.range && store.hud.voice.range > 0 && store.hud.voice.range < 4
                ? store.hud.voice.range
                : 2

        let micDefaultRange = Array(micStatus).fill(true)
        micDefaultRange.push(...Array(3 - micStatus).fill(false))

        return micDefaultRange
    }

    return (
        <StateContext.Provider value={store}>
            <DispatchContext.Provider
                value={{
                    updateStatus,
                    updateSpeedo,
                    updateHud,
                    updateParty,
                    getSpeedInDeg,
                    getDamageLevel,
                    changeVoiceRange,
                    currentMicRangeStatus,
                }}
            >
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

export const useHudStorageState = () => useContext(StateContext)
export const useHudStorageDispatch = () => useContext(DispatchContext)
