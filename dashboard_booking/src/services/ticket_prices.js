import { handleApiRequest, instance } from "./instance";

// Base URL for buses
const URL_ticket_prices = "/api/ticket-prices";
const URL_PROMOTION = "/api/promotions";
const URL_TRIPS = "/api/trips";
// Create a new bus
export const createTicketPrices = async (TicketPricesCreationRequest) => {
  return handleApiRequest(async () => {
    const response = await instance.post(
      URL_ticket_prices,
      TicketPricesCreationRequest
    );
    return response.data;
  });
};

// Get all buses
export const getAllTicketPrices = async () => {
  return handleApiRequest(async () => {
    const response = await instance.get(URL_ticket_prices);

    return response.data;
  });
};

export const getAllPromotions = async () => {
  return handleApiRequest(async () => {
    const response = await instance.get(URL_PROMOTION);
    // Set isActive based on startDate and endDate
    const currentDate = new Date();
    const promotions = response.data.map((promotion) => ({
      ...promotion,
      isActive:
        new Date(promotion.startDate) <= currentDate &&
        new Date(promotion.endDate) >= currentDate,
    }));
    return promotions;
  });
};

export const getAllTrips = async () => {
  return handleApiRequest(async () => {
    const response = await instance.get(URL_TRIPS);
    const trip = response.data;
    console.log("res", trip);
    return trip;
  });
};

// Get all trips
// export const getAllTrips = async () => {
//   const trips = await getAllTrips();
//   const ticketPrices = [];

//   for (const trip of trips) {
//     // Assuming trip has a 'price' property
//     ticketPrices.push({
//       tripId: trip.id,
//       price: trip.price,
//     });
//   }

//   return ticketPrices;
// };



export const getTicketPricesById = async (ticketPricesId) => {
  return handleApiRequest(async () => {
    const response = await instance.get(
      `${URL_ticket_prices}/${ticketPricesId}`
    );
    return response.data;
  });
};


export const updateTicketPrice = async (
  ticketPricesId,
  TicketPricesUpdateRequest
) => {
  return handleApiRequest(async () => {
    const response = await instance.put(
      `${URL_ticket_prices}/${ticketPricesId}`,
      TicketPricesUpdateRequest
    );
    return response.data.result;
  });
};

export const deleteTicketPrices = async (ticketPricesId) => {
  return handleApiRequest(async () => {
    const response = await instance.delete(
      `${URL_ticket_prices}/${ticketPricesId}`
    );
    return response.data;
  });
};
