import { Show } from 'solid-js'
import { useHudStorageState } from '../Contexts/HudStorage'
import { DisconnectIcon } from '../Icons'
import { CountdownBar, LineProgress } from './LineProgress'
import './Party.css'

const User = (props) => {
    return (
        <div className={props.online ? 'player' : 'playeroffline'}>
            <p>{props.name}</p>
            <div className='bar'>
                <Show when={props.armor > 0 && props.health > 0}>
                    <LineProgress
                        progressLevel={`${props.armor}%`}
                        color={'#ffffff'}
                    />
                </Show>
                <Show when={props.health > 0}>
                    <LineProgress
                        progressLevel={`${props.health - 100}%`}
                        color={'#00d0c4'}
                    />
                </Show>
            </div>
            {/* Render DisconnectIcon nur wenn der Benutzer offline ist */}
            {!props.online && <DisconnectIcon />}
        </div>
    )
}

export const Party = (props) => {
    const hudStorageState = useHudStorageState()

    return (
        <div className='container'>
            <For each={hudStorageState.party}>
                {(player, i) => (
                    <Show when={!player.name.includes('Player')}>
                        <User
                            key={i}
                            name={player.name}
                            armor={player.armor}
                            health={player.health}
                            online={player.online}
                        />
                    </Show>
                )}
            </For>
        </div>
    )
}
