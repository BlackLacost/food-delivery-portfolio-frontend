import { Placemark } from '@pbe/react-yandex-maps'

type Props = {
  coords: any
  title: any
}
// type Props = {
//   coords: [number, number]
//   title: string
// }

export const PlacemarkWithTitle = ({ coords, title }: Props) => {
  return (
    <Placemark
      geometry={coords}
      modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
      options={{
        preset: 'islands#greenStretchyIcon',
        openBalloonOnClick: true,
        openHintOnHover: true,
        balloonPanelMaxMapArea: Infinity,
      }}
      properties={{
        balloonContentHeader: title,
        balloonContentBody:
          '<div class="text-lime-600 text-xl">Описание заказа</div>',
        iconContent: title,
        hintContent: title,
      }}
      // instanceRef={(ref) => {
      //   if (!ref) return null

      //   ref.properties.set({
      //     iconContent: title,
      //   })
      // }}
    />
  )
}
