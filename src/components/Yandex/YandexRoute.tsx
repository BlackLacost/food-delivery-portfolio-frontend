import { RoutePanel } from '@pbe/react-yandex-maps'

type Props = {
  from: [number, number]
  to: [number, number]
}

export const YandexRoute = ({ from, to }: Props) => {
  return (
    <RoutePanel
      options={{ float: 'right' }}
      instanceRef={(ref) => {
        if (ref) {
          ref.routePanel.state.set({
            fromEnabled: false,
            toEnabled: false,
            from,
            to,
            type: 'auto',
          })
        }
      }}
    />
  )
}
