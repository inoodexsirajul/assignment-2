import { pool } from "../../config/db";

const createBooking = async (
  customerId: number,
  vehicleId: number,
  start: string,
  end: string
) => {
  const avail = await pool.query(
    `SELECT availability_status FROM vehicles WHERE id = $1`,
    [vehicleId]
  );

  if (avail.rows[0]?.availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  const overlap = await pool.query(
    `SELECT id FROM bookings 
     WHERE vehicle_id = $1 
     AND status = 'active'
     AND (rent_start_date <= $2 AND rent_end_date >= $3)`,
    [vehicleId, end, start]
  );

  if (overlap.rowCount > 0) {
    throw new Error("Vehicle already booked in this period");
  }
  // 3. Calculate price
  const vehicle = await pool.query(
    `SELECT daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicleId]
  );
  console.log(vehicle);
  const days = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)
  );
  const total_price = days * vehicle.rows[0].daily_rent_price;

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicleId]
  );

  const booking = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [customerId, vehicleId, start, end, total_price]
  );

  return booking.rows[0];
};

const getAllBookings = async (userId: number, role: "admin" | "customer") => {
  const isAdmin = role === "admin";

  // কোনো কমা সমস্যা ছাড়াই ফিল্ড যোগ করছি
  const customerFields = isAdmin
    ? ", u.name AS customer_name, u.email AS customer_email"
    : "";

  const customerJoin = isAdmin ? "JOIN users u ON u.id = b.customer_id" : "";

  const whereClause = isAdmin ? "TRUE" : "b.customer_id = $1";

  const query = `
    SELECT 
      b.id,
      b.customer_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type AS vehicle_type
      ${customerFields}
    FROM bookings b
    JOIN vehicles v ON v.id = b.vehicle_id
    ${customerJoin}
    WHERE ${whereClause}
    ORDER BY b.created_at DESC
  `.trim();

  const { rows } = await pool.query(query, isAdmin ? [] : [userId]);

  return rows.map((row) => ({
    id: row.id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: Number(row.total_price),
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.vehicle_type,
    },
    ...(isAdmin && {
      customer_id: row.customer_id,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
    }),
  }));
};

const updateBookingStatus = async (
  bookingId: number,
  newStatus: "cancelled" | "returned",
  userId: number,
  userRole: "admin" | "customer"
) => {
  const bookingRes = await pool.query(
    `SELECT b.*, v.availability_status 
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.id = $1 FOR UPDATE`,
    [bookingId]
  );

  if (bookingRes.rowCount === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];
  const currentStatus = booking.status;

  if (currentStatus === "cancelled" || currentStatus === "returned") {
    throw new Error(`Booking is already ${currentStatus}`);
  }

  if (newStatus === "cancelled") {
    if (userRole !== "customer" || booking.customer_id !== userId) {
      throw new Error("You can only cancel your own booking");
    }

    if (new Date(booking.rent_start_date) < new Date()) {
      throw new Error("Cannot cancel booking after start date has passed");
    }
  }

  if (newStatus === "returned") {
    if (userRole !== "admin") {
      throw new Error("Only admin can mark booking as returned");
    }
  }

  const updatedBookingRes = await pool.query(
    `UPDATE bookings 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
    [newStatus, bookingId]
  );

  const updatedBooking = updatedBookingRes.rows[0];

  if (newStatus === "returned") {
    await pool.query(
      `UPDATE vehicles 
         SET availability_status = 'available' 
         WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  const response: any = {
    id: updatedBooking.id,
    customer_id: updatedBooking.customer_id,
    vehicle_id: updatedBooking.vehicle_id,
    rent_start_date: updatedBooking.rent_start_date,
    rent_end_date: updatedBooking.rent_end_date,
    total_price: Number(updatedBooking.total_price),
    status: updatedBooking.status,
  };

  return response;
};

const bookingService = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};

export default bookingService;
