import { db } from "@/server/db";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSideProps } from "next";
import { api } from "@/utils/api";
import Map from 'react-map-gl';

// @ts-expect-error leave this alone
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (userId) {
    const account = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });

    if (account?.status === "ACTIVE") {
      return {
        redirect: {
          destination: "/packages",
        },
      };
    }
  }

  return { props: {} };
};

const PackagesPage = () => {
  const { isLoaded } = useUser();

  const { data: subscriptionSessionData } =
    api.stripe.getSubscriptionCheckoutURL.useQuery(void {}, {
      enabled: isLoaded,
    });

  const { data: lifetimeSessionData } =
    api.stripe.getLifeTimeCheckoutURL.useQuery(void {}, {
      enabled: isLoaded,
    });

  const handleGoToSubscriptionCheckoutSession = async () => {
    const redirectURL = subscriptionSessionData?.redirectURL;

    if (redirectURL) {
      window.location.assign(redirectURL);
    }
  };

  const handleGoToLifetimeCheckoutSession = async () => {
    const redirectURL = lifetimeSessionData?.redirectURL;

    if (redirectURL) {
      window.location.assign(redirectURL);
    }
  };

  return (

    <Map
    mapboxAccessToken="pk.eyJ1IjoibWV0YWJ1cmVhdSIsImEiOiJjbHY3Z2M2ODgwOXBpMmltcTg4NGtldXBhIn0.uCGDG4Dt7KVkwFRFsK_11w"
    initialViewState={{
      longitude: -122.4,
      latitude: 37.8,
      zoom: 14
    }}
    style={{width: 600, height: 400}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  />


  );
};

export default PackagesPage;
