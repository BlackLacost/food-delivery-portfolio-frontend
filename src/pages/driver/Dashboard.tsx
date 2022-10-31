import { useSubscription } from '@apollo/client'
import { Map, RoutePanel, YMaps } from '@pbe/react-yandex-maps'
import { Button } from '../../components/Button'
import { graphql } from '../../gql'
import { useDriverCoords } from '../../hooks/driver-coords.hook'

const CoockedOrders_Subscription = graphql(`
  subscription CookedOrders_Subscription {
    cookedOrders {
      id
    }
  }
`)

export const Dashboard = () => {
  const driverCoords = useDriverCoords()
  const { data: coockedOrdersData } = useSubscription(
    CoockedOrders_Subscription
  )
  return (
    <div>
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_KEY }}>
        <Map
          width={window.innerWidth}
          height="90vh"
          state={{
            center: driverCoords,
            zoom: 14,
            controls: ['zoomControl', 'fullscreenControl'],
          }}
          modules={['control.ZoomControl', 'control.FullscreenControl']}
        >
          {coockedOrdersData?.cookedOrders && (
            <RoutePanel
              options={{ float: 'right' }}
              instanceRef={(ref) => {
                if (ref) {
                  ref.routePanel.state.set({
                    fromEnabled: false,
                    toEnabled: false,
                    from: driverCoords,
                    to: [55.751574, 37.573856],
                    type: 'auto',
                  })
                }
              }}
            />
          )}
        </Map>
      </YMaps>
      <div className="relative mx-auto -my-60 max-w-screen-sm space-y-5 bg-white p-10 shadow-lg">
        {coockedOrdersData?.cookedOrders ? (
          <>
            <h1 className="text-center text-2xl">New Coocked Order</h1>
            <p>{JSON.stringify(coockedOrdersData.cookedOrders, null, 2)}</p>
            <Button className="w-full">Accept Order &rarr;</Button>
          </>
        ) : (
          <h1 className="text-center text-2xl">No Orders Yet...</h1>
        )}
      </div>
    </div>
  )
}
